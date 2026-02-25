import { Request, Response } from 'express';
    import pool from '../config/db';
    import { sseClients } from '../index'; // Ensure this import is correct

    export const getProducts = async (req: Request, res: Response) => {
      try {
        const [rows] = await pool.query('SELECT * FROM producto');
        res.json(rows);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
      }
    };

    export const createProduct = async (req: Request, res: Response) => {
      const { nombre_producto, precio_producto } = req.body;
      try {
        const [result] = await pool.query('INSERT INTO producto (nombre_producto, precio_producto) VALUES (?, ?)', [nombre_producto, precio_producto]);
        const newProductId = (result as any).insertId;
        res.status(201).json({ codigo_producto: newProductId, nombre_producto, precio_producto });

        // Broadcast to all SSE clients
        console.log('Broadcasting to', sseClients.length, 'clients');
        sseClients.forEach(client => {
          if (!client.headersSent) {
            client.write(`data: ${JSON.stringify([{ codigo_producto: newProductId, nombre_producto, precio_producto }])}\n\n`);
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
      }
    };