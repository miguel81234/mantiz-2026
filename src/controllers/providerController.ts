import { Request, Response } from 'express';
import pool from '../config/db';
import { Provider } from '../models/provider';

export const getProviders = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM provedores');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching providers' });
  }
};

export const createProvider = async (req: Request, res: Response) => {
  const provider: Provider = req.body;
  try {
    const [result] = await pool.query('INSERT INTO provedores SET ?', [provider]);
    res.status(201).json({ id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating provider' });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
  const { codigo_provedor } = req.params;
  const provider: Provider = req.body;
  try {
    await pool.query('UPDATE provedores SET ? WHERE codigo_provedor = ?', [provider, codigo_provedor]);
    res.json({ message: 'Provider updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating provider' });
  }
};

export const deleteProvider = async (req: Request, res: Response) => {
  const { codigo_provedor } = req.params;
  try {
    await pool.query('DELETE FROM provedores WHERE codigo_provedor = ?', [codigo_provedor]);
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting provider' });
  }
};