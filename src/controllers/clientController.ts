// src/controllers/clientController.ts

import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';

// GET /api/clients - Obtener todos los clientes
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes');

    console.log(`Se encontraron ${rows.length} clientes`);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

// POST /api/clients - Crear un nuevo cliente
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📥 Datos recibidos:', req.body);

    const {
      documento,
      nombre,
      apellido,
      celular,
      correo,
      direccion,
      ciudad,
    } = req.body;

    if (!documento || !nombre || !apellido) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: documento, nombre, apellido',
      });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO clientes 
       (documento, nombre, apellido, celular, correo, direccion, ciudad) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        documento,
        nombre,
        apellido,
        celular   || null,
        correo    || null,
        direccion || null,
        ciudad    || null,
      ]
    );

    console.log('✅ Cliente creado con ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Cliente creado correctamente',
      codigo_cliente: result.insertId,
    });

  } catch (error: any) {
    console.error('❌ Error al crear cliente:', error);

    // Duplicado en campo único (ej: documento ya existe)
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        success: false,
        message: 'Ya existe un cliente con ese documento',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message,
    });
  }
};