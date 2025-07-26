// Global type definitions for backend

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYE';

import 'express';
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}
