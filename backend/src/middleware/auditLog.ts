import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';

export async function logAudit(action: string, table: string, rowId: number | null, details: string, req: Request) {
  try {
    await AuditLog.create({
      userId: req.user ? req.user.id : null,
      action,
      table,
      rowId,
      details,
    });
  } catch (err) {
    // Optionnel : log dans la console
    console.error('Erreur audit log', err);
  }
}

// Middleware générateur pour usage dans routes :
export function auditLogMiddleware(action: string, table: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      if (['POST', 'PUT', 'DELETE'].includes(req.method) && res.statusCode < 400) {
        let rowId = null;
        if (res.locals.rowId) rowId = res.locals.rowId;
        await logAudit(action, table, rowId, JSON.stringify(req.body), req);
      }
    });
    next();
  };
}
