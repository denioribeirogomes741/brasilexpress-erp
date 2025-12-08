import oracledb from 'oracledb';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const INSTANT_CLIENT_PATH = process.env.INSTANT_CLIENT_PATH || 'C:\\oracle\\instantclient_23_0';
const WALLET_PATH = process.env.WALLET_PATH || path.join(__dirname, '..', 'wallet');
const DB_USER = process.env.DB_USER || 'ADMIN';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_CONNECTIONSTRING = process.env.DB_CONNECTIONSTRING || '';

try {
  oracledb.initOracleClient({ libDir: INSTANT_CLIENT_PATH });
  console.log('Oracle Client inicializado com libDir:', INSTANT_CLIENT_PATH);
} catch (err) {
  console.error('Erro ao inicializar Oracle Client:', err);
}

const poolConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  connectString: DB_CONNECTIONSTRING,
  poolMin: Number(process.env.POOL_MIN || 1),
  poolMax: Number(process.env.POOL_MAX || 4),
  poolIncrement: 1,
  poolTimeout: 60,
  queueTimeout: 60000,
  poolAlias: 'default'
};

let pool: oracledb.Pool | null = null;

export async function init() {
  process.env.TNS_ADMIN = path.resolve(WALLET_PATH);
  console.log('TNS_ADMIN:', process.env.TNS_ADMIN);

  try {
    // tenta pegar o pool existente
    pool = oracledb.getPool('default');
    console.log('Pool já existente reutilizado');
    return pool;
  } catch (err) {
    // se não existe, cria um novo
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