import { Request, Response } from 'express';
import pool from '../config/db';
import { Admin } from '../models/admin';

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM administrador');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  const admin: Admin = req.body;
  try {
    const [result] = await pool.query('INSERT INTO administrador SET ?', [admin]);
    res.status(201).json({ id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin' });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  const { codigo_administrador } = req.params;
  const admin: Admin = req.body;
  try {
    await pool.query('UPDATE administrador SET ? WHERE codigo_administrador = ?', [admin, codigo_administrador]);
    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin' });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const { codigo_administrador } = req.params;
  try {
    await pool.query('DELETE FROM administrador WHERE codigo_administrador = ?', [codigo_administrador]);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
};