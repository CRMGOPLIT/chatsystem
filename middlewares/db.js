

const sql = require('mssql');




const config = {
  user: 'sa',
  password: 'fidM3h7j5y648t29',
  server: '180.179.212.50', 
  port: 1533,
  database: 'crmGlobal',
   options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};


async function connectSQL() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
   console.error('Error connecting to SQL Server:', err);
  }
  
}








module.exports = { connectSQL, sql };









