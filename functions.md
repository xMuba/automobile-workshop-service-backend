# API Functions & Database Schema Documentation

This document outlines all database models, enums, and their relationships in the Automobile Workshop Management System.

## Enums

### Role
- `ADMIN` - Workshop manager with full system administrative access
- `MECHANIC` - Service technician assigned to work orders and repairs
- `CUSTOMER` - Vehicle owner accessing portal services

### AppointmentStatus
- `PENDING` - Appointment request submitted by customer
- `CONFIRMED` - Appointment confirmed by workshop staff
- `IN_PROGRESS` - Vehicle currently being serviced
- `COMPLETED` - Work finished and ready for pickup
- `CANCELLED` - Appointment cancelled by customer or staff

### ServiceStatus
- `NOT_STARTED` - Service item pending mechanic assignment
- `IN_PROGRESS` - Mechanic actively working on the service
- `COMPLETED` - Service item finished and inspected
- `ON_HOLD` - Service waiting for parts or customer approval

### PaymentStatus
- `UNPAID` - Invoice generated but no payment received
- `PARTIAL` - Partial payment made against total bill
- `PAID` - Invoice settled in full
- `REFUNDED` - Payment refunded to customer

---

## Data Models (12 Total)

### User
System user account representing Admins, Mechanics, or Customers.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Full name of the user
- `email` (String, Unique) - Email address used for authentication
- `password` (String) - Hashed password
- `phone` (String) - Contact phone number
- `role` (Role) - User role (default: CUSTOMER)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `vehicles` - One-to-many with Vehicle (if customer)
- `assignedServices` - One-to-many with ServiceTask (if mechanic)
- `auditLogs` - One-to-many with AuditLog

---

### Vehicle
Customer-owned vehicle registered for workshop service.

**Fields:**
- `id` (UUID) - Primary key
- `customerId` (String, Foreign Key) - ID of the owning user
- `vin` (String, Unique) - Vehicle Identification Number
- `licensePlate` (String, Unique) - License plate number
- `make` (String) - Manufacturer (e.g., Toyota, Ford)
- `model` (String) - Vehicle model name
- `year` (Int) - Manufacturing year
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `customer` - Many-to-one with User
- `appointments` - One-to-many with Appointment
- `serviceHistories` - One-to-many with ServiceHistory

**Indexes:**
- `customerId`
- `licensePlate`

---

### ServiceCatalog
Master listing of offered workshop services and standard pricing.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Name of service (e.g., Oil Change, Brake Inspection)
- `description` (String) - Detailed description of work performed
- `basePrice` (Decimal) - Standard labor/service cost
- `estimatedDuration` (Int) - Estimated duration in minutes
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `serviceTasks` - One-to-many with ServiceTask

---

### Appointment
Scheduled workshop visit for a vehicle.

**Fields:**
- `id` (UUID) - Primary key
- `vehicleId` (String, Foreign Key) - Vehicle ID
- `scheduledAt` (DateTime) - Date and time of appointment
- `status` (AppointmentStatus) - Booking status (default: PENDING)
- `notes` (String) - Initial customer complaint or service notes
- `isDeleted` (Boolean) - Soft delete flag (default: false)
- `deletedAt` (DateTime) - Soft delete timestamp
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `vehicle` - Many-to-one with Vehicle
- `serviceTasks` - One-to-many with ServiceTask
- `invoice` - One-to-one with Invoice

**Indexes:**
- `vehicleId`
- `status`
- `scheduledAt`

---

### ServiceTask
Individual task assigned as part of an overall appointment.

**Fields:**
- `id` (UUID) - Primary key
- `appointmentId` (String, Foreign Key) - Appointment ID
- `serviceCatalogId` (String, Foreign Key) - Catalog item ID
- `mechanicId` (String, Foreign Key, Optional) - Assigned mechanic ID
- `status` (ServiceStatus) - Current task progress (default: NOT_STARTED)
- `cost` (Decimal) - Final charge for task
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `appointment` - Many-to-one with Appointment
- `catalogItem` - Many-to-one with ServiceCatalog
- `mechanic` - Many-to-one with User
- `partsUsed` - One-to-many with UsedPart

**Indexes:**
- `appointmentId`
- `mechanicId`
- `status`

---

### InventoryItem
Spare parts and inventory stock tracking.

**Fields:**
- `id` (UUID) - Primary key
- `partNumber` (String, Unique) - OEM or internal part code
- `name` (String) - Part name (e.g., Oil Filter, Brake Pad)
- `unitPrice` (Decimal) - Selling price per unit
- `quantityInStock` (Int) - Available inventory count
- `reorderLevel` (Int) - Low stock threshold trigger
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `usedParts` - One-to-many with UsedPart

---

### UsedPart
Junction table tracking inventory parts consumed during a service task.

**Fields:**
- `id` (UUID) - Primary key
- `serviceTaskId` (String, Foreign Key) - Service task ID
- `inventoryItemId` (String, Foreign Key) - Inventory part ID
- `quantity` (Int) - Quantity consumed
- `unitPrice` (Decimal) - Locked-in price at time of use
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `serviceTask` - Many-to-one with ServiceTask
- `inventoryItem` - Many-to-one with InventoryItem

---

### Invoice
Billing record generated upon completion of services.

**Fields:**
- `id` (UUID) - Primary key
- `appointmentId` (String, Foreign Key, Unique) - Associated appointment ID
- `totalAmount` (Decimal) - Total bill calculated (labor + parts)
- `status` (PaymentStatus) - Payment state (default: UNPAID)
- `dueDate` (DateTime) - Due date for billing settlement
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `appointment` - One-to-one with Appointment
- `payments` - One-to-many with Payment

---

### Payment
Payment transaction records against an invoice.

**Fields:**
- `id` (UUID) - Primary key
- `invoiceId` (String, Foreign Key) - Invoice ID
- `amount` (Decimal) - Payment amount received
- `paymentMethod` (String) - Method used (CARD, CASH, ONLINE)
- `transactionRef` (String) - Payment gateway reference ID
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `invoice` - Many-to-one with Invoice

---

### ServiceHistory
Archival record documenting completed services for vehicle history lookup.

**Fields:**
- `id` (UUID) - Primary key
- `vehicleId` (String, Foreign Key) - Vehicle ID
- `summary` (String) - Detailed breakdown of repairs made
- `mileageAtService` (Int) - Vehicle odometer reading
- `completedAt` (DateTime) - Completion date
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `vehicle` - Many-to-one with Vehicle

---

### AuditLog
System-wide audit trail for administrative modifications and security.

**Fields:**
- `id` (UUID) - Primary key
- `userId` (String, Foreign Key) - User who performed action
- `action` (String) - Action details (e.g., INVENTORY_UPDATE, USER_BAN)
- `ipAddress` (String) - Client IP address
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `user` - Many-to-one with User

---

## Relationships Summary

### One-to-Many Relationships
- User → Vehicle, ServiceTask, AuditLog
- Vehicle → Appointment, ServiceHistory
- ServiceCatalog → ServiceTask
- Appointment → ServiceTask
- ServiceTask → UsedPart
- InventoryItem → UsedPart
- Invoice → Payment

### One-to-One Relationships
- Appointment ↔ Invoice

### Many-to-One Relationships
- Vehicle → User
- Appointment → Vehicle
- ServiceTask → Appointment, ServiceCatalog, User
- UsedPart → ServiceTask, InventoryItem
- Invoice → Appointment
- Payment → Invoice
- ServiceHistory → Vehicle
- AuditLog → User

---

## Key Design Patterns

1. **Soft Deletes**: `Appointment` utilizes soft deletes (`isDeleted`, `deletedAt`) to maintain history without destroying cancelled schedules.
2. **Cascading Soft References**: Deleting inventory or service catalogs retains snapshots in `UsedPart` and `ServiceTask` using historical price values (`unitPrice`, `cost`).
3. **Audit Trail**: High-stakes modifications (inventories, user updates) record caller identity via `AuditLog`.
4. **Relational Constraints**: Composite unique key constraints on `Vehicle` (`vin`, `licensePlate`) prevent duplicate record entries.