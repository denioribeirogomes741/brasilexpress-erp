import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import { init, closePool } from './db';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use('/api', routes);

const PORT = Number(process.env.PORT || 3001);

init().then(() => {
  const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

  process.on('SIGINT', async () => { console.log('Shutting down...'); await closePool(); server.close(); process.exit(0); });
});