# Postman Collection JSON Export

Save the content below into a file named **`automobile_workshop.postman_collection.json`** and import it into Postman.

```json
{
  "info": {
    "_postman_id": "a9b8c7d6-e5f4-4321-abcd-1234567890ef",
    "name": "Automobile Workshop API Engine",
    "description": "Automobile Workshop Backend Collection generated from Prisma Schema",
    "schema": "[https://schema.getpostman.com/json/collection/v2.1.0/collection.json](https://schema.getpostman.com/json/collection/v2.1.0/collection.json)"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "1. Auth Layer",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"phone\": \"+1234567890\",\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"CUSTOMER\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"phone\": \"+1234567890\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "2. Customer & Vehicle Setup",
      "item": [
        {
          "name": "Create Customer Profile",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"phone\": \"+1234567890\",\n  \"email\": \"john@example.com\",\n  \"address\": \"742 Evergreen Terrace\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/customers",
              "host": ["{{baseUrl}}"],
              "path": ["customers"]
            }
          }
        },
        {
          "name": "Create Vehicle Type",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type_name\": \"Sedan\",\n  \"description\": \"4-door passenger car\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/vehicle-types",
              "host": ["{{baseUrl}}"],
              "path": ["vehicle-types"]
            }
          }
        },
        {
          "name": "Register Vehicle",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"customer_id\": \"<INSERT_CUSTOMER_UUID>\",\n  \"vehicle_type_id\": \"<INSERT_VEHICLE_TYPE_UUID>\",\n  \"registration_no\": \"REG-9081\",\n  \"make\": \"Honda\",\n  \"model\": \"Civic\",\n  \"year\": 2021,\n  \"fuel_type\": \"Petrol\",\n  \"color\": \"Black\",\n  \"mileage\": 25000\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/vehicles",
              "host": ["{{baseUrl}}"],
              "path": ["vehicles"]
            }
          }
        }
      ]
    },
    {
      "name": "3. Appointments & Inspections",
      "item": [
        {
          "name": "Book Appointment",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"customer_id\": \"<INSERT_CUSTOMER_UUID>\",\n  \"vehicle_id\": \"<INSERT_VEHICLE_UUID>\",\n  \"appointment_date\": \"2026-08-15T10:00:00Z\",\n  \"notes\": \"Regular maintenance service check.\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/appointments",
              "host": ["{{baseUrl}}"],
              "path": ["appointments"]
            }
          }
        },
        {
          "name": "Submit Inspection Report",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"appointment_id\": \"<INSERT_APPOINTMENT_UUID>\",\n  \"employee_id\": \"<INSERT_EMPLOYEE_UUID>\",\n  \"findings\": \"Oil filter dirty, rear tires worn out.\",\n  \"condition_rating\": \"Good\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/inspection-reports",
              "host": ["{{baseUrl}}"],
              "path": ["inspection-reports"]
            }
          }
        }
      ]
    },
    {
      "name": "4. Workshop & Services",
      "item": [
        {
          "name": "Create Service Order",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"vehicle_id\": \"<INSERT_VEHICLE_UUID>\",\n  \"employee_id\": \"<INSERT_EMPLOYEE_UUID>\",\n  \"inspection_id\": \"<INSERT_INSPECTION_UUID>\",\n  \"status\": \"Waiting\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/service-orders",
              "host": ["{{baseUrl}}"],
              "path": ["service-orders"]
            }
          }
        }
      ]
    },
    {
      "name": "5. Invoicing & Billing",
      "item": [
        {
          "name": "Generate Invoice",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"order_id\": \"<INSERT_ORDER_UUID>\",\n  \"service_total\": 120.00,\n  \"parts_total\": 45.00,\n  \"tax\": 13.20,\n  \"grand_total\": 178.20\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/invoices",
              "host": ["{{baseUrl}}"],
              "path": ["invoices"]
            }
          }
        },
        {
          "name": "Process Payment",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"invoice_id\": \"<INSERT_INVOICE_UUID>\",\n  \"amount\": 178.20,\n  \"method\": \"CASH\",\n  \"status\": \"COMPLETED\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/payments",
              "host": ["{{baseUrl}}"],
              "path": ["payments"]
            }
          }
        }
      ]
    }
  ]
}

```

```