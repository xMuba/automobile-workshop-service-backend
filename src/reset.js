import prisma from './database/prisma.js';

async function resetDatabase() {
  try {
    console.log('🧹 Clearing all data...');

    // Order matters — children first, parents last
    await prisma.payment.deleteMany();
    console.log('✓ Payments deleted');

    await prisma.invoice.deleteMany();
    console.log('✓ Invoices deleted');

    await prisma.partsUsed.deleteMany();
    console.log('✓ PartsUsed deleted');

    await prisma.orderService.deleteMany();
    console.log('✓ OrderServices deleted');

    await prisma.serviceOrder.deleteMany();
    console.log('✓ ServiceOrders deleted');

    await prisma.inspectionReport.deleteMany();
    console.log('✓ InspectionReports deleted');

    await prisma.appointment.deleteMany();
    console.log('✓ Appointments deleted');

    await prisma.vehicle.deleteMany();
    console.log('✓ Vehicles deleted');

    await prisma.partsInventory.deleteMany();
    console.log('✓ PartsInventory deleted');

    await prisma.supplier.deleteMany();
    console.log('✓ Suppliers deleted');

    await prisma.serviceType.deleteMany();
    console.log('✓ ServiceTypes deleted');

    await prisma.vehicleType.deleteMany();
    console.log('✓ VehicleTypes deleted');

    await prisma.user.deleteMany();
    console.log('✓ Users deleted');

    await prisma.employee.deleteMany();
    console.log('✓ Employees deleted');

    await prisma.customer.deleteMany();
    console.log('✓ Customers deleted');

    console.log('\n🎉 Database wiped clean!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  }
}

resetDatabase();