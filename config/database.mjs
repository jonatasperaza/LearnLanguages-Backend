import postgres from 'postgres';
import './dotenv.mjs';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

export default sql;
