import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request, locals }) => {
	try {
		const db =
			(locals as any)?.runtime?.env?.DB ||
			(request as any)?.env?.DB ||
			(globalThis as any)?.env?.DB;

		if (!db) {
			return new Response(JSON.stringify({ error: 'DB binding not found' }), {
				status: 500,
			});
		}

		// 1. Total rescued portions (only completed claims)
		const { results: totalRescuedRaw } = await db
			.prepare(
				`
      SELECT SUM(f.quantity_portions) as total 
      FROM food_listings f 
      JOIN claims c ON f.id = c.listing_id 
      WHERE c.status = 'completed'
    `,
			)
			.all();
		const totalRescued = totalRescuedRaw[0]?.total || 0;

		// 2. Top Schools (Providers) - only completed rescues
		const { results: topSchools } = await db
			.prepare(
				`
      SELECT u.id, u.name, u.organization, SUM(f.quantity_portions) as total_rescued
      FROM users u
      JOIN food_listings f ON u.id = f.provider_id
      JOIN claims c ON f.id = c.listing_id
      WHERE u.role = 'provider' AND c.status = 'completed'
      GROUP BY u.id
      ORDER BY total_rescued DESC
      LIMIT 5
    `,
			)
			.all();

		// 3. Top Volunteers (Receivers)
		const { results: topVolunteers } = await db
			.prepare(
				`
      SELECT id, name, email, points
      FROM users
      WHERE role = 'receiver'
      ORDER BY points DESC
      LIMIT 5
    `,
			)
			.all();

		// 4. Active Schools
		const { results: activeSchoolsRaw } = await db
			.prepare(`SELECT COUNT(id) as total FROM users WHERE role = 'provider'`)
			.all();
		const activeSchools = activeSchoolsRaw[0]?.total || 0;

		// 5. Total Volunteers
		const { results: totalVolunteersRaw } = await db
			.prepare(`SELECT COUNT(id) as total FROM users WHERE role = 'receiver'`)
			.all();
		const totalVolunteers = totalVolunteersRaw[0]?.total || 0;

		// 6. Dynamic current date logic based on latest completed claim
		const { results: maxDateRaw } = await db
			.prepare("SELECT MAX(date(claimed_at)) as max_date FROM claims WHERE status = 'completed'")
			.all();
		const maxDateVal = maxDateRaw[0]?.max_date;
		const baseDate = maxDateVal ? new Date(maxDateVal + 'T12:00:00Z') : new Date();
		const baseDateStr = baseDate.toISOString().split('T')[0];

		// Chart Data (Last 7 Days relative to baseDate) - only completed rescues
		const { results: foodHistoryRaw } = await db
			.prepare(
				`
      SELECT date(c.claimed_at) as dt, f.category, SUM(f.quantity_portions) as total 
      FROM food_listings f 
      JOIN claims c ON f.id = c.listing_id 
      WHERE c.status = 'completed' AND c.claimed_at >= date(?, '-6 days') AND c.claimed_at <= date(?, '+1 days')
      GROUP BY dt, f.category
    `,
			)
			.bind(baseDateStr, baseDateStr)
			.all();

		const { results: userHistoryRaw } = await db
			.prepare(
				`
      SELECT date(created_at) as dt, role, COUNT(id) as total 
      FROM users 
      WHERE created_at >= date(?, '-6 days') AND created_at <= date(?, '+1 days')
      GROUP BY dt, role
    `,
			)
			.bind(baseDateStr, baseDateStr)
			.all();

		// Format historical data into 7-day arrays
		const chartData = {
			labels: [] as string[],
			consumable: [] as number[],
			farm: [] as number[],
			newSchools: [] as number[],
			newVolunteers: [] as number[],
		};

		// Generate last 7 days relative to baseDate (including today)
		for (let i = 6; i >= 0; i--) {
			const d = new Date(baseDate);
			d.setDate(d.getDate() - i);
			const dtStr = d.toISOString().split('T')[0];
			const displayStr = d.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
			});

			chartData.labels.push(displayStr);

			const consumableDay = foodHistoryRaw.find(
				(r) =>
					r.dt === dtStr &&
					(r.category === 'consumption' ||
						r.category === 'consumable' ||
						r.category === 'Consumable'),
			);
			chartData.consumable.push(Number(consumableDay?.total || 0));

			const farmDay = foodHistoryRaw.find(
				(r) =>
					r.dt === dtStr &&
					(r.category === 'farm' || r.category === 'Farm/Fertilizer'),
			);
			chartData.farm.push(Number(farmDay?.total || 0));

			const newSchoolsDay = userHistoryRaw.find(
				(r) => r.dt === dtStr && r.role === 'provider',
			);
			chartData.newSchools.push(Number(newSchoolsDay?.total || 0));

			const newVolunteersDay = userHistoryRaw.find(
				(r) => r.dt === dtStr && r.role === 'receiver',
			);
			chartData.newVolunteers.push(Number(newVolunteersDay?.total || 0));
		}

		return new Response(
			JSON.stringify({
				totalRescued,
				topSchools,
				topVolunteers,
				activeSchools,
				totalVolunteers,
				chartData,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
};
