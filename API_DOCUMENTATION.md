# Automobile Workshop API Documentation

This document describes the API endpoints, expected request bodies, and database relations for the Automobile Workshop Management System.

---

## 1. Authentication Layer

### Register User
* **Endpoint:** `POST /api/v1/auth/register`
* **Description:** Register a new user account (Customer, Employee, or Admin).
* **Request Body:**
```json
{
  "phone": "+1234567890",
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "CUSTOMER"
}

```

### Login User

* **Endpoint:** `POST /api/v1/auth/login`
* **Description:** Authenticate using phone and password.
* **Request Body:**

```json
{
  "phone": "+1234567890",
  "password": "securePassword123"
}

```

### Verify OTP

* **Endpoint:** `POST /api/v1/auth/verify-otp`
* **Description:** Authenticate via OTP code sent to phone number.
* **Request Body:**

```json
{
  "phone": "+1234567890",
  "otp": "123456"
}

```

---

## 2. Customer & Vehicle Management

### Create Customer Profile

* **Endpoint:** `POST /api/v1/customers`
* **Request Body:**

```json
{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "email": "jane@example.com",
  "address": "123 Main Street"
}

```

### Create Vehicle Type

* **Endpoint:** `POST /api/v1/vehicle-types`
* **Request Body:**

```json
{
  "type_name": "SUV",
  "description": "Sport Utility Vehicle"
}

```

### Register Vehicle

* **Endpoint:** `POST /api/v1/vehicles`
* **Request Body:**

```json
{
  "customer_id": "c1f7b8a0-1234-4567-89ab-cdef01234567",
  "vehicle_type_id": "v7f8b9a0-1234-4567-89ab-cdef01234567",
  "registration_no": "ABC-1234",
  "make": "Toyota",
  "model": "RAV4",
  "year": 2022,
  "fuel_type": "Hybrid",
  "color": "Silver",
  "mileage": 15000
}

```

---

## 3. Employee Management

### Create Employee

* **Endpoint:** `POST /api/v1/employees`
* **Request Body:**

```json
{
  "name": "Alex Smith",
  "phone": "+1987654321",
  "role": "MECHANIC",
  "salary": 4500.00,
  "hire_date": "2024-01-15"
}

```

---

## 4. Appointments & Inspection Reports

### Create Appointment

* **Endpoint:** `POST /api/v1/appointments`
* **Request Body:**

```json
{
  "customer_id": "c1f7b8a0-1234-4567-89ab-cdef01234567",
  "vehicle_id": "v8f9b0a1-1234-4567-89ab-cdef01234567",
  "appointment_date": "2026-08-10T09:00:00Z",
  "notes": "Engine light on and strange braking noise"
}

```

### Submit Inspection Report

* **Endpoint:** `POST /api/v1/inspection-reports`
* **Request Body:**

```json
{
  "appointment_id": "a1f2b3c4-1234-4567-89ab-cdef01234567",
  "employee_id": "e1f2b3c4-1234-4567-89ab-cdef01234567",
  "findings": "Brake pads worn down. Oil filter replacement recommended.",
  "condition_rating": "Fair"
}

```

---

## 5. Service Orders & Catalog

### Create Service Type

* **Endpoint:** `POST /api/v1/service-types`
* **Request Body:**

```json
{
  "service_name": "Full Brake Replacement",
  "description": "Front and rear pad and rotor replacement",
  "base_price": 250.00
}

```

### Create Service Order

* **Endpoint:** `POST /api/v1/service-orders`
* **Request Body:**

```json
{
  "vehicle_id": "v8f9b0a1-1234-4567-89ab-cdef01234567",
  "employee_id": "e1f2b3c4-1234-4567-89ab-cdef01234567",
  "inspection_id": "i1f2b3c4-1234-4567-89ab-cdef01234567",
  "status": "In Progress"
}

```

### Link Service to Order

* **Endpoint:** `POST /api/v1/order-services`
* **Request Body:**

```json
{
  "order_id": "o1f2b3c4-1234-4567-89ab-cdef01234567",
  "service_type_id": "s1f2b3c4-1234-4567-89ab-cdef01234567",
  "price": 250.00
}

```

---

## 6. Inventory & Suppliers

### Register Supplier

* **Endpoint:** `POST /api/v1/suppliers`
* **Request Body:**

```json
{
  "name": "AutoParts Direct Inc.",
  "contact_person": "Mark Wayne",
  "phone": "+15550192834",
  "address": "450 Industrial Parkway"
}

```

### Add Inventory Item

* **Endpoint:** `POST /api/v1/inventory`
* **Request Body:**

```json
{
  "supplier_id": "sup1f2b3-1234-4567-89ab-cdef01234567",
  "part_name": "Ceramic Brake Pad Set",
  "part_number": "BP-9921",
  "quantity": 50,
  "unit_price": 45.00,
  "reorder_level": 10
}

```

### Record Parts Used

* **Endpoint:** `POST /api/v1/parts-used`
* **Request Body:**

```json
{
  "order_id": "o1f2b3c4-1234-4567-89ab-cdef01234567",
  "part_id": "p1f2b3c4-1234-4567-89ab-cdef01234567",
  "quantity_used": 2,
  "unit_price": 45.00
}

```

---

## 7. Invoices & Payments

### Issue Invoice

* **Endpoint:** `POST /api/v1/invoices`
* **Request Body:**

```json
{
  "order_id": "o1f2b3c4-1234-4567-89ab-cdef01234567",
  "service_total": 250.00,
  "parts_total": 90.00,
  "tax": 27.20,
  "grand_total": 367.20
}

```

### Process Payment

* **Endpoint:** `POST /api/v1/payments`
* **Request Body:**

```json
{
  "invoice_id": "inv1f2b3-1234-4567-89ab-cdef01234567",
  "amount": 367.20,
  "method": "CREDIT_CARD",
  "status": "COMPLETED"
}

```