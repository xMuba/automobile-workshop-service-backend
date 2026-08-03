-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" INTEGER,
    "employee_id" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "registration_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "vehicle_type" (
    "vehicle_type_id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "vehicle_type_pkey" PRIMARY KEY ("vehicle_type_id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "vehicle_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "vehicle_type_id" INTEGER,
    "registration_no" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "fuel_type" TEXT,
    "color" TEXT,
    "mileage" INTEGER,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "employee" (
    "employee_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "salary" DECIMAL(10,2),
    "hire_date" DATE,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "appointment_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "inspection_report" (
    "inspection_id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "findings" TEXT,
    "condition_rating" TEXT,
    "inspection_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspection_report_pkey" PRIMARY KEY ("inspection_id")
);

-- CreateTable
CREATE TABLE "service_order" (
    "order_id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "employee_id" INTEGER,
    "inspection_id" INTEGER,
    "start_date" DATE,
    "end_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'Waiting',

    CONSTRAINT "service_order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "service_type" (
    "service_type_id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2),

    CONSTRAINT "service_type_pkey" PRIMARY KEY ("service_type_id")
);

-- CreateTable
CREATE TABLE "order_service" (
    "order_service_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_service_pkey" PRIMARY KEY ("order_service_id")
);

-- CreateTable
CREATE TABLE "parts_inventory" (
    "part_id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "part_name" TEXT NOT NULL,
    "part_number" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2),
    "reorder_level" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "parts_inventory_pkey" PRIMARY KEY ("part_id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "supplier_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "parts_used" (
    "parts_used_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "part_id" INTEGER NOT NULL,
    "quantity_used" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "parts_used_pkey" PRIMARY KEY ("parts_used_id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "invoice_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "service_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "parts_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "invoice_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Pending',

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_customer_id_key" ON "user"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_employee_id_key" ON "user"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_registration_no_key" ON "vehicle"("registration_no");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_report_appointment_id_key" ON "inspection_report"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_order_inspection_id_key" ON "service_order"("inspection_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_order_id_key" ON "invoice"("order_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_vehicle_type_id_fkey" FOREIGN KEY ("vehicle_type_id") REFERENCES "vehicle_type"("vehicle_type_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_report" ADD CONSTRAINT "inspection_report_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("appointment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_report" ADD CONSTRAINT "inspection_report_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspection_report"("inspection_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_service" ADD CONSTRAINT "order_service_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "service_order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_service" ADD CONSTRAINT "order_service_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("service_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_inventory" ADD CONSTRAINT "parts_inventory_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_used" ADD CONSTRAINT "parts_used_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "service_order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_used" ADD CONSTRAINT "parts_used_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "parts_inventory"("part_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "service_order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;
