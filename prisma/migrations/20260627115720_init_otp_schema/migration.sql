/*
  Warnings:

  - The primary key for the `appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `inspection_report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `order_service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `parts_inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `parts_used` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `service_order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `employee_id` column on the `service_order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `inspection_id` column on the `service_order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `service_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `customer_id` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `employee_id` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `vehicle_type_id` column on the `vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `vehicle_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `appointment_id` on the `appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customer_id` on the `appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicle_id` on the `appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customer_id` on the `customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `phone` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `employee_id` on the `employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `phone` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `inspection_id` on the `inspection_report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `appointment_id` on the `inspection_report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `employee_id` on the `inspection_report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `invoice_id` on the `invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_service_id` on the `order_service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `order_service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `service_type_id` on the `order_service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `part_id` on the `parts_inventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `supplier_id` on the `parts_inventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `parts_used_id` on the `parts_used` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `parts_used` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `part_id` on the `parts_used` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `payment_id` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `invoice_id` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `service_order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicle_id` on the `service_order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `service_type_id` on the `service_type` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `supplier_id` on the `supplier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `phone` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `user_id` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicle_id` on the `vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customer_id` on the `vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicle_type_id` on the `vehicle_type` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('MANAGER', 'MECHANIC', 'TECHNICIAN', 'RECEPTIONIST');

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report" DROP CONSTRAINT "inspection_report_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report" DROP CONSTRAINT "inspection_report_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_service" DROP CONSTRAINT "order_service_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_service" DROP CONSTRAINT "order_service_service_type_id_fkey";

-- DropForeignKey
ALTER TABLE "parts_inventory" DROP CONSTRAINT "parts_inventory_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "parts_used" DROP CONSTRAINT "parts_used_order_id_fkey";

-- DropForeignKey
ALTER TABLE "parts_used" DROP CONSTRAINT "parts_used_part_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "service_order" DROP CONSTRAINT "service_order_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "service_order" DROP CONSTRAINT "service_order_inspection_id_fkey";

-- DropForeignKey
ALTER TABLE "service_order" DROP CONSTRAINT "service_order_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_vehicle_type_id_fkey";

-- AlterTable
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_pkey",
DROP COLUMN "appointment_id",
ADD COLUMN     "appointment_id" UUID NOT NULL,
DROP COLUMN "customer_id",
ADD COLUMN     "customer_id" UUID NOT NULL,
DROP COLUMN "vehicle_id",
ADD COLUMN     "vehicle_id" UUID NOT NULL,
ADD CONSTRAINT "appointment_pkey" PRIMARY KEY ("appointment_id");

-- AlterTable
ALTER TABLE "customer" DROP CONSTRAINT "customer_pkey",
DROP COLUMN "customer_id",
ADD COLUMN     "customer_id" UUID NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id");

-- AlterTable
ALTER TABLE "employee" DROP CONSTRAINT "employee_pkey",
DROP COLUMN "employee_id",
ADD COLUMN     "employee_id" UUID NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "EmployeeRole" NOT NULL,
ADD CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id");

-- AlterTable
ALTER TABLE "inspection_report" DROP CONSTRAINT "inspection_report_pkey",
DROP COLUMN "inspection_id",
ADD COLUMN     "inspection_id" UUID NOT NULL,
DROP COLUMN "appointment_id",
ADD COLUMN     "appointment_id" UUID NOT NULL,
DROP COLUMN "employee_id",
ADD COLUMN     "employee_id" UUID NOT NULL,
ADD CONSTRAINT "inspection_report_pkey" PRIMARY KEY ("inspection_id");

-- AlterTable
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_pkey",
DROP COLUMN "invoice_id",
ADD COLUMN     "invoice_id" UUID NOT NULL,
DROP COLUMN "order_id",
ADD COLUMN     "order_id" UUID NOT NULL,
ADD CONSTRAINT "invoice_pkey" PRIMARY KEY ("invoice_id");

-- AlterTable
ALTER TABLE "order_service" DROP CONSTRAINT "order_service_pkey",
DROP COLUMN "order_service_id",
ADD COLUMN     "order_service_id" UUID NOT NULL,
DROP COLUMN "order_id",
ADD COLUMN     "order_id" UUID NOT NULL,
DROP COLUMN "service_type_id",
ADD COLUMN     "service_type_id" UUID NOT NULL,
ADD CONSTRAINT "order_service_pkey" PRIMARY KEY ("order_service_id");

-- AlterTable
ALTER TABLE "parts_inventory" DROP CONSTRAINT "parts_inventory_pkey",
DROP COLUMN "part_id",
ADD COLUMN     "part_id" UUID NOT NULL,
DROP COLUMN "supplier_id",
ADD COLUMN     "supplier_id" UUID NOT NULL,
ADD CONSTRAINT "parts_inventory_pkey" PRIMARY KEY ("part_id");

-- AlterTable
ALTER TABLE "parts_used" DROP CONSTRAINT "parts_used_pkey",
DROP COLUMN "parts_used_id",
ADD COLUMN     "parts_used_id" UUID NOT NULL,
DROP COLUMN "order_id",
ADD COLUMN     "order_id" UUID NOT NULL,
DROP COLUMN "part_id",
ADD COLUMN     "part_id" UUID NOT NULL,
ADD CONSTRAINT "parts_used_pkey" PRIMARY KEY ("parts_used_id");

-- AlterTable
ALTER TABLE "payment" DROP CONSTRAINT "payment_pkey",
DROP COLUMN "payment_id",
ADD COLUMN     "payment_id" UUID NOT NULL,
DROP COLUMN "invoice_id",
ADD COLUMN     "invoice_id" UUID NOT NULL,
ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id");

-- AlterTable
ALTER TABLE "service_order" DROP CONSTRAINT "service_order_pkey",
DROP COLUMN "order_id",
ADD COLUMN     "order_id" UUID NOT NULL,
DROP COLUMN "vehicle_id",
ADD COLUMN     "vehicle_id" UUID NOT NULL,
DROP COLUMN "employee_id",
ADD COLUMN     "employee_id" UUID,
DROP COLUMN "inspection_id",
ADD COLUMN     "inspection_id" UUID,
ADD CONSTRAINT "service_order_pkey" PRIMARY KEY ("order_id");

-- AlterTable
ALTER TABLE "service_type" DROP CONSTRAINT "service_type_pkey",
DROP COLUMN "service_type_id",
ADD COLUMN     "service_type_id" UUID NOT NULL,
ADD CONSTRAINT "service_type_pkey" PRIMARY KEY ("service_type_id");

-- AlterTable
ALTER TABLE "supplier" DROP CONSTRAINT "supplier_pkey",
DROP COLUMN "supplier_id",
ADD COLUMN     "supplier_id" UUID NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ADD CONSTRAINT "supplier_pkey" PRIMARY KEY ("supplier_id");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL,
DROP COLUMN "customer_id",
ADD COLUMN     "customer_id" UUID,
DROP COLUMN "employee_id",
ADD COLUMN     "employee_id" UUID,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_pkey",
DROP COLUMN "vehicle_id",
ADD COLUMN     "vehicle_id" UUID NOT NULL,
DROP COLUMN "customer_id",
ADD COLUMN     "customer_id" UUID NOT NULL,
DROP COLUMN "vehicle_type_id",
ADD COLUMN     "vehicle_type_id" UUID,
ADD CONSTRAINT "vehicle_pkey" PRIMARY KEY ("vehicle_id");

-- AlterTable
ALTER TABLE "vehicle_type" DROP CONSTRAINT "vehicle_type_pkey",
DROP COLUMN "vehicle_type_id",
ADD COLUMN     "vehicle_type_id" UUID NOT NULL,
ADD CONSTRAINT "vehicle_type_pkey" PRIMARY KEY ("vehicle_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_report_appointment_id_key" ON "inspection_report"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_order_id_key" ON "invoice"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_order_inspection_id_key" ON "service_order"("inspection_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_customer_id_key" ON "user"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_employee_id_key" ON "user"("employee_id");

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
