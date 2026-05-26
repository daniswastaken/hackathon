const fs = require('fs');

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const startDate = new Date('2026-05-03T00:00:00Z');
const endDate = new Date('2026-06-03T00:00:00Z');

const formatSqlDate = (date) => {
    return date.toISOString().replace('T', ' ').slice(0, 19);
};

let sql = '';
let insertValues = [];

for (let i = 1; i <= 300; i++) {
    const isSchool = true;
    const email = `synth_school${i}@synthetic.example.com`;
    const name = `Synthetic School ${i}`;
    const role = 'provider';
    const createdAt = formatSqlDate(generateRandomDate(startDate, endDate));
    
    insertValues.push(`('${email}', '123', '${role}', '${name}', '${name}', '${createdAt}')`);
}

for (let i = 1; i <= 300; i++) {
    const email = `synth_volunteer${i}@synthetic.example.com`;
    const name = `Synthetic Volunteer ${i}`;
    const role = 'receiver';
    const createdAt = formatSqlDate(generateRandomDate(startDate, endDate));
    
    insertValues.push(`('${email}', '123', '${role}', '${name}', NULL, '${createdAt}')`);
}

// Batch inserts
const batchSize = 100;
for (let i = 0; i < insertValues.length; i += batchSize) {
    const batch = insertValues.slice(i, i + batchSize);
    sql += `INSERT INTO users (email, password, role, name, organization, created_at) VALUES\n${batch.join(',\n')};\n\n`;
}

fs.writeFileSync('x:\\hackathon\\scratch\\insert_synth_users.sql', sql);
console.log('SQL generated successfully.');
