import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './models';
import routes from './routes';

const app = express();
const PORT = 3001; // Forcer le port 3001

// Middleware
// Autoriser plusieurs origines pour le front (ex: 3000 et 3002 en dev)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3002'
];

app.use(cors({
  origin: (origin, callback) => {
    // origin peut être undefined pour des requêtes same-origin ou outils
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origine non autorisée par CORS: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

// Routes
app.use('/api', routes);

// Static files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Start server
sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  });
}).catch((error) => {
  console.error('❌ Erreur de connexion à la base de données:', error);
});

export default app;
