import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './database/prisma.js';

// ─── ES MODULE PATH FIX ───
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── ROUTE IMPORTS ───
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import serviceOrderRoutes from './routes/serviceOrderRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import partsRoutes from './routes/partsRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import serviceTypeRoutes from './routes/serviceTypeRoutes.js';
import vehicleTypeRoutes from './routes/vehicleTypeRoutes.js';

const app = express();

// ─── MIDDLEWARE ───
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the root "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// ─── ROUTES ───
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/orders', serviceOrderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/service-types', serviceTypeRoutes);
app.use('/api/vehicle-types', vehicleTypeRoutes);

// ─── HEALTH CHECK ───
app.get('/health', (req, res) => {
  res.json({ status: 'Automobile Workshop API running' });
});

// ─── 404 HANDLER ───
app.use((req, res) => {
  res.status(404).json({ status: 'Not Found', message: 'Resource not found' });
});

// ─── GLOBAL ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'Error',
    message: err.message || 'Internal Server Error',
  });
});

// ─── START SERVER ───
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const server = app.listen(PORT, () => {
      console.log(`🚗 Workshop server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();