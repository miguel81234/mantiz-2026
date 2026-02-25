export interface Client {
  codigo_cliente: number; // Optional, auto-incremented by DB
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro?: Date; // Optional, set by DB or backend
  password: string; // Hashed password
}