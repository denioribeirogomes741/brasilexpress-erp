import oracledb from 'oracledb';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 🔹 paths ABSOLUTOS
const WALLET_PATH = path.resolve(__dirname, '..', 'wallet');

// 🔹 variáveis do banco
const DB_USER = process.env.DB_USER!;
const DB_PASSWORD = process.env.DB_PASSWORD!;
const DB_CONNECTIONSTRING = process.env.DB_CONNECTIONSTRING!;

// 🔹 TNS_ADMIN ANTES de tudo
process.env.TNS_ADMIN = WALLET_PATH;
console.log('TNS_ADMIN:', process.env.TNS_ADMIN);

// 🔹 inicializa client (sem path Windows)
oracledb.initOracleClient();

const poolConfig: oracledb.PoolAttributes = {
  user: DB_USER,
  password: DB_PASSWORD,
  connectString: DB_CONNECTIONSTRING, // ex: brasilexpressdatabase_low
  poolMin: Number(process.env.POOL_MIN || 1),
  poolMax: Number(process.env.POOL_MAX || 4),
  poolIncrement: 1,
  poolTimeout: 60,
  queueTimeout: 60000,
  poolAlias: 'default'
};

let pool: oracledb.Pool | null = null;

export async function init() {
  try {
    pool = oracledb.getPool('default');
    console.log('Pool reutilizado');
    return pool;
  } catch {
    pool = await oracledb.createPool(poolConfig);
    console.log('Novo pool criado');
    return pool;
  }
}

export async function getPool() {
  if (!pool) pool = await init();
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close(10);
    pool = null;
    console.log('Pool fechado');
  }
}
