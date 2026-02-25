import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import clientRoutes from './routes/clientRoutes';
import authRoutes from './routes/authRoutes';
import pool from './config/db';

export const sseClients: Response[] = [];

const app = express();
const PORT = 3000;

const FRONTEND_ROOT = path.join(__dirname, '../marketplace-html');
const FRONTEND_PAGES = path.join(__dirname, '../marketplace-html/pages');

app.use(cors({ origin: '*' }));
app.use(express.json());

// Rutas API
app.use('/api/clients', clientRoutes);
app.use('/api', authRoutes);  // ← esta línea faltaba

// Archivos estáticos (css, js, assets, modelos-3D)
app.use(express.static(FRONTEND_ROOT));

// También sirve pages como estático
app.use(express.static(FRONTEND_PAGES));

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(FRONTEND_PAGES, 'index.html'));
});

// Fallback SPA
app.get('*splat', (req: Request, res: Response) => {
  res.sendFile(path.join(FRONTEND_PAGES, 'index.html'));
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Conectado a la base de datos`);
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
});