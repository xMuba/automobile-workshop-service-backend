import prisma from './database/prisma.js';

async function seed() {
  console.log('🧹 Clearing old data...');
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.partsUsed.deleteMany();
  await prisma.orderService.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.inspectionReport.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.partsInventory.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.serviceType.deleteMany();
  await prisma.vehicleType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.customer.deleteMany();
  console.log('✓ Old data cleared\n');
  console.log('🌱 Seeding database with Bangladeshi demo data...');

  try {
    // ─── 1. VEHICLE TYPES ───
    const sedan = await prisma.vehicleType.create({
      data: { type_name: 'Sedan', description: 'Standard passenger car' }
    });
    const suv = await prisma.vehicleType.create({
      data: { type_name: 'SUV', description: 'Sport Utility Vehicle' }
    });
    const pickup = await prisma.vehicleType.create({
      data: { type_name: 'Pickup', description: 'Light commercial truck' }
    });
    const bike = await prisma.vehicleType.create({
      data: { type_name: 'Motorcycle', description: 'Two-wheeler' }
    });
    console.log('✓ Vehicle types created');

    // ─── 2. SERVICE TYPES ───
    const oilChange = await prisma.serviceType.create({
      data: { service_name: 'Engine Oil Change', description: 'Full synthetic oil replacement', base_price: 2500 }
    });
    const brakeService = await prisma.serviceType.create({
      data: { service_name: 'Brake Pad Replacement', description: 'Front and rear brake pad service', base_price: 3500 }
    });
    const acRepair = await prisma.serviceType.create({
      data: { service_name: 'AC Gas Refill & Repair', description: 'Compressor check and gas refill', base_price: 4500 }
    });
    const tuneUp = await prisma.serviceType.create({
      data: { service_name: 'Engine Tune-Up', description: 'Spark plug, filter, and timing check', base_price: 5000 }
    });
    const wheelAlign = await prisma.serviceType.create({
      data: { service_name: 'Wheel Alignment', description: 'Computerized wheel balancing', base_price: 1500 }
    });
    console.log('✓ Service types created');

    // ─── 3. SUPPLIERS ───
    const rahimAuto = await prisma.supplier.create({
      data: { name: 'Rahim Auto Parts', contact_person: 'Abdul Rahim', phone: '01711223344', address: 'Nawabpur Road, Dhaka' }
    });
    const karimParts = await prisma.supplier.create({
      data: { name: 'Karim Motors Supply', contact_person: 'Karim Hossain', phone: '01822334455', address: 'Chawkbazar, Chattogram' }
    });
    const bashundhara = await prisma.supplier.create({
      data: { name: 'Bashundhara Lubricants', contact_person: 'Nazmul Islam', phone: '01933445566', address: 'Tejgaon Industrial Area, Dhaka' }
    });
    console.log('✓ Suppliers created');

    // ─── 4. CUSTOMERS ───
    const customer1 = await prisma.customer.create({
      data: {
        name: 'Mohammad Rahman',
        phone: '01712345678',
        email: 'rahman.bhai@gmail.com',
        address: 'House 42, Road 3, Dhanmondi, Dhaka'
      }
    });
    const customer2 = await prisma.customer.create({
      data: {
        name: 'Fatima Begum',
        phone: '01823456789',
        email: 'fatima.apa@yahoo.com',
        address: 'Flat 5B, Gulshan Avenue, Dhaka'
      }
    });
    const customer3 = await prisma.customer.create({
      data: {
        name: 'Kamal Hossain Chowdhury',
        phone: '01934567890',
        email: 'kamal.chowdhury@gmail.com',
        address: 'Agrabad, Chattogram'
      }
    });
    const customer4 = await prisma.customer.create({
      data: {
        name: 'Sultana Jahan',
        phone: '01645678901',
        email: null,
        address: 'Zindabazar, Sylhet'
      }
    });
    console.log('✓ Customers created');

    // ─── 5. EMPLOYEES ───
    const manager = await prisma.employee.create({
      data: {
        name: 'Anwar Hossain',
        phone: '01755667788',
        role: 'MANAGER',
        salary: 45000.00,
        hire_date: new Date('2022-03-15')
      }
    });
    const mechanic1 = await prisma.employee.create({
      data: {
        name: 'Jalal Uddin',
        phone: '01866778899',
        role: 'MECHANIC',
        salary: 28000.00,
        hire_date: new Date('2023-01-10')
      }
    });
    const mechanic2 = await prisma.employee.create({
      data: {
        name: 'Shahidul Islam',
        phone: '01977889900',
        role: 'TECHNICIAN',
        salary: 25000.00,
        hire_date: new Date('2023-06-20')
      }
    });
    const receptionist = await prisma.employee.create({
      data: {
        name: 'Nasrin Akter',
        phone: '01688990011',
        role: 'RECEPTIONIST',
        salary: 20000.00,
        hire_date: new Date('2024-02-01')
      }
    });
    console.log('✓ Employees created');

    // ─── 6. USERS ───
    await prisma.user.create({
      data: {
        phone: manager.phone,
        password: '$2a$10$dummyhashforseed',
        role: 'EMPLOYEE',
        employee_id: manager.employee_id
      }
    });
    await prisma.user.create({
      data: {
        phone: customer1.phone,
        password: '$2a$10$dummyhashforseed',
        role: 'CUSTOMER',
        customer_id: customer1.customer_id
      }
    });
    console.log('✓ Users created');

    // ─── 7. VEHICLES ───
    const vehicle1 = await prisma.vehicle.create({
      data: {
        customer_id: customer1.customer_id,
        vehicle_type_id: sedan.vehicle_type_id,
        registration_no: 'DHAKA-Metro-G-1234',
        make: 'Toyota',
        model: 'Corolla Axio',
        year: 2018,
        fuel_type: 'Petrol',
        color: 'Silver',
        mileage: 45000
      }
    });
    const vehicle2 = await prisma.vehicle.create({
      data: {
        customer_id: customer2.customer_id,
        vehicle_type_id: suv.vehicle_type_id,
        registration_no: 'DHAKA-Metro-H-5678',
        make: 'Mitsubishi',
        model: 'Pajero Sport',
        year: 2020,
        fuel_type: 'Diesel',
        color: 'Black',
        mileage: 28000
      }
    });
    const vehicle3 = await prisma.vehicle.create({
      data: {
        customer_id: customer3.customer_id,
        vehicle_type_id: pickup.vehicle_type_id,
        registration_no: 'CHATTO-Metro-TA-9012',
        make: 'Toyota',
        model: 'Hilux',
        year: 2019,
        fuel_type: 'Diesel',
        color: 'White',
        mileage: 62000
      }
    });
    const vehicle4 = await prisma.vehicle.create({
      data: {
        customer_id: customer1.customer_id,
        vehicle_type_id: bike.vehicle_type_id,
        registration_no: 'SYLHET-Metro-LA-3456',
        make: 'Hero',
        model: 'Splendor Plus',
        year: 2022,
        fuel_type: 'Petrol',
        color: 'Red',
        mileage: 12000
      }
    });
    console.log('✓ Vehicles created');

    // ─── 8. PARTS INVENTORY ───
    const oilFilter = await prisma.partsInventory.create({
      data: {
        supplier_id: rahimAuto.supplier_id,
        part_name: 'Engine Oil Filter (Toyota)',
        part_number: 'OF-TYT-001',
        quantity: 25,
        unit_price: 450.00,
        reorder_level: 10
      }
    });
    const brakePad = await prisma.partsInventory.create({
      data: {
        supplier_id: rahimAuto.supplier_id,
        part_name: 'Brake Pad Set (Front)',
        part_number: 'BP-FR-002',
        quantity: 8,
        unit_price: 2800.00,
        reorder_level: 5
      }
    });
    const engineOil = await prisma.partsInventory.create({
      data: {
        supplier_id: bashundhara.supplier_id,
        part_name: 'Full Synthetic Engine Oil 5W-30 (4L)',
        part_number: 'EO-5W30-4L',
        quantity: 15,
        unit_price: 3200.00,
        reorder_level: 8
      }
    });
    const acGas = await prisma.partsInventory.create({
      data: {
        supplier_id: karimParts.supplier_id,
        part_name: 'R134a AC Refrigerant Gas',
        part_number: 'ACG-R134A',
        quantity: 12,
        unit_price: 1800.00,
        reorder_level: 5
      }
    });
    const sparkPlug = await prisma.partsInventory.create({
      data: {
        supplier_id: rahimAuto.supplier_id,
        part_name: 'NGK Iridium Spark Plug',
        part_number: 'NGK-IR-004',
        quantity: 30,
        unit_price: 650.00,
        reorder_level: 12
      }
    });
    const airFilter = await prisma.partsInventory.create({
      data: {
        supplier_id: karimParts.supplier_id,
        part_name: 'Air Filter (Mitsubishi Pajero)',
        part_number: 'AF-PAJ-005',
        quantity: 6,
        unit_price: 1200.00,
        reorder_level: 4
      }
    });
    console.log('✓ Parts inventory created');

    // ─── 9. APPOINTMENTS ───
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    nextWeek.setHours(14, 30, 0, 0);

    const appointment1 = await prisma.appointment.create({
      data: {
        customer_id: customer1.customer_id,
        vehicle_id: vehicle1.vehicle_id,
        appointment_date: tomorrow,
        status: 'Confirmed',
        notes: 'Regular servicing and oil change needed'
      }
    });
    const appointment2 = await prisma.appointment.create({
      data: {
        customer_id: customer2.customer_id,
        vehicle_id: vehicle2.vehicle_id,
        appointment_date: nextWeek,
        status: 'Pending',
        notes: 'AC not cooling properly, check compressor'
      }
    });
    const appointment3 = await prisma.appointment.create({
      data: {
        customer_id: customer3.customer_id,
        vehicle_id: vehicle3.vehicle_id,
        appointment_date: new Date(),
        status: 'Completed',
        notes: 'Brake pad replacement and wheel alignment'
      }
    });
    console.log('✓ Appointments created');

    // ─── 10. INSPECTION REPORTS ───
    const inspection1 = await prisma.inspectionReport.create({
      data: {
        appointment_id: appointment3.appointment_id,
        employee_id: mechanic1.employee_id,
        findings: 'Front brake pads worn below 2mm. Rear pads at 40%. Wheel alignment off by 3 degrees on left front.',
        condition_rating: 'Fair',
        inspection_date: new Date()
      }
    });
    console.log('✓ Inspection reports created');

    // ─── 11. SERVICE ORDERS ───
    const order1 = await prisma.serviceOrder.create({
      data: {
        vehicle_id: vehicle3.vehicle_id,
        employee_id: mechanic1.employee_id,
        inspection_id: inspection1.inspection_id,
        start_date: new Date(),
        status: 'In Progress',
        paymentStatus: 'PENDING'
      }
    });
    const order2 = await prisma.serviceOrder.create({
      data: {
        vehicle_id: vehicle1.vehicle_id,
        employee_id: mechanic2.employee_id,
        start_date: tomorrow,
        status: 'Waiting',
        paymentStatus: 'PENDING'
      }
    });
    console.log('✓ Service orders created');

    // ─── 12. ORDER SERVICES ───
    await prisma.orderService.create({
      data: {
        order_id: order1.order_id,
        service_type_id: brakeService.service_type_id,
        price: 3500.00
      }
    });
    await prisma.orderService.create({
      data: {
        order_id: order1.order_id,
        service_type_id: wheelAlign.service_type_id,
        price: 1500.00
      }
    });
    await prisma.orderService.create({
      data: {
        order_id: order2.order_id,
        service_type_id: oilChange.service_type_id,
        price: 2500.00
      }
    });
    console.log('✓ Order services created');

    // ─── 13. PARTS USED ───
    await prisma.partsUsed.create({
      data: {
        order_id: order1.order_id,
        part_id: brakePad.part_id,
        quantity_used: 1,
        unit_price: 2800.00
      }
    });
    await prisma.partsUsed.create({
      data: {
        order_id: order1.order_id,
        part_id: airFilter.part_id,
        quantity_used: 1,
        unit_price: 1200.00
      }
    });
    await prisma.partsUsed.create({
      data: {
        order_id: order2.order_id,
        part_id: engineOil.part_id,
        quantity_used: 1,
        unit_price: 3200.00
      }
    });
    await prisma.partsUsed.create({
      data: {
        order_id: order2.order_id,
        part_id: oilFilter.part_id,
        quantity_used: 1,
        unit_price: 450.00
      }
    });
    console.log('✓ Parts used created');

    // ─── 14. INVOICES ───
    const invoice1 = await prisma.invoice.create({
      data: {
        order_id: order1.order_id,
        service_total: 5000.00,
        parts_total: 4000.00,
        tax: 900.00,
        grand_total: 9900.00
      }
    });
    console.log('✓ Invoices created');

    // ─── 15. PAYMENTS ───
    await prisma.payment.create({
      data: {
        invoice_id: invoice1.invoice_id,
        amount: 5000.00,
        method: 'bKash',
        status: 'Completed'
      }
    });
    await prisma.payment.create({
      data: {
        invoice_id: invoice1.invoice_id,
        amount: 4900.00,
        method: 'Cash',
        status: 'Pending'
      }
    });
    console.log('✓ Payments created');

    console.log('\n🎉 Database seeded successfully with demo data!');
    console.log('\n📋 Summary:');
    console.log('   • 4 Vehicle Types');
    console.log('   • 5 Service Types');
    console.log('   • 3 Suppliers');
    console.log('   • 4 Customers');
    console.log('   • 4 Employees');
    console.log('   • 2 Users');
    console.log('   • 4 Vehicles');
    console.log('   • 6 Parts in Inventory');
    console.log('   • 3 Appointments');
    console.log('   • 1 Inspection Report');
    console.log('   • 2 Service Orders');
    console.log('   • 1 Invoice (TK 9,900)');
    console.log('   • 2 Payments (bKash + Cash)');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();