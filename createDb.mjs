import mysql from 'mysql2/promise'; 

async function setupDb() {
  const databaseUrl = process.env.DATABASE_URL || 'mysql://root@localhost:3306/belajar_vibe_coding';
  
  // Parse the database URL to get connection details
  const url = new URL(databaseUrl);
  const host = url.hostname;
  const port = url.port || 3306;
  const user = url.username;
  const password = decodeURIComponent(url.password || '');
  
  const connection = await mysql.createConnection({ 
    host, 
    user, 
    password, 
    port: Number(port)
  }); 
  
  await connection.query('CREATE DATABASE IF NOT EXISTS belajar_vibe_coding;'); 
  await connection.query('DROP DATABASE IF EXISTS belajar_vibe_conding;'); 
  await connection.end(); 
  console.log('Database renamed/fixed'); 
} 

setupDb().catch(console.error);
