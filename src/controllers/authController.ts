// src/controllers/authController.ts

import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import pool from '../config/db';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios: username, email, password',
      });
      return;
    }

    // Verificar si ya existe el usuario o email
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM usuarios WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      res.status(409).json({
        ok: false,
        message: 'El usuario o email ya está registrado',
      });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    console.log('✅ Usuario registrado con ID:', result.insertId);

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      id: result.insertId,
    });

  } catch (error: any) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
};