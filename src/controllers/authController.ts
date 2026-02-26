// src/controllers/authController.ts

import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'mantiz_secret_key_2024';

// POST /api/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios: nombre, email, password',
      });
      return;
    }

    // Verificar si ya existe el email
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      res.status(409).json({
        ok: false,
        message: 'El email ya está registrado',
      });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario con rol cliente (id_rol = 2)
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuarios (nombre, email, password, telefono, direccion, id_rol, estado)
       VALUES (?, ?, ?, ?, ?, 2, true)`,
      [nombre, email, hashedPassword, telefono || null, direccion || null]
    );

    console.log('✅ Usuario registrado con ID:', result.insertId);

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: result.insertId,
        nombre,
        email,
        rol: 'cliente',
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      token,
      usuario: {
        id_usuario: result.insertId,
        nombre,
        email,
        rol: 'cliente',
      },
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

// POST /api/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios: email, password',
      });
      return;
    }

    // Buscar usuario con su rol
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.*, r.nombre as rol
       FROM usuarios u
       LEFT JOIN roles r ON u.id_rol = r.id_rol
       WHERE u.email = ? AND u.estado = true`,
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas',
      });
      return;
    }

    const user = rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas',
      });
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        nombre:     user.nombre,
        email:      user.email,
        rol:        user.rol,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log('✅ Login exitoso:', user.email);

    res.status(200).json({
      ok: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: user.id_usuario,
        nombre:     user.nombre,
        email:      user.email,
        rol:        user.rol,
      },
    });

  } catch (error: any) {
    console.error('❌ Error al iniciar sesión:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};