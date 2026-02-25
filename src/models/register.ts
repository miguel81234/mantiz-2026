// src/models/register.ts

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}