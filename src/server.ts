import mysql from 'mysql2';
import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: './config.env' });

const pool = mysql
  .createPool({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  })
  .promise();

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

export default pool;
