# 🔧 FixItNow - Service Marketplace Backend API

FixItNow is a Service Marketplace Backend API where customers can book home services, technicians can manage their services and bookings, and admins can manage the entire platform. The project is built with Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, and Stripe Payment Integration.


## 🚀 Live API

```
https://fix-it-now-backend-ten.vercel.app/

```

---

## 📂 Repository

```
https://github.com/sumonkhan0077/FixItNow-backend
```

---

# 🔑 Demo Credentials

| Role         |  Email        |  Password  |

| 👨‍💼 Admin | `admin@gmail.com` | `admin123` |

# ✨ Features

## Authentication

- Register (Customer / Technician / Admin)
- Login with JWT
- Get Current User Profile
- Role Based Authorization
- Secure Password Hashing

## Customer

- Browse Services
- Create Booking
- View My Bookings
- Make Stripe Payment
- Payment History
- Submit Review

## Technician

- Create Technician Profile
- Update Profile
- Manage Availability
- Create / Update / Delete Services
- View Assigned Bookings
- Update Booking Status

## Admin

- View All Users
- Change User Status
- Change User Role
- Manage Categories
- View All Bookings
- View All Payments
- Delete Reviews

---

# 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Stripe Checkout
- Vercel

---

# 📁 Project Structure

```
src
│
├── app.ts
├── server.ts
│
├── config
├── middleware
├── modules
│   ├── auth
│   ├── booking
│   ├── category
│   ├── payment
│   ├── review
│   ├── service
│   ├── technicianProfile
│   └── user
│
├── utils
```

---

# ⚙️ Installation

Clone Repository

```bash
git clone https://github.com/sumonkhan0077/FixItNow-backend
```

Go to project

```bash
cd FixTtNow-backend
```

Install packages

```bash
npm install
```

---

# Environment Variables

Create a `.env` file

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

APP_URL=
```

---

# Database Setup

Generate Prisma Client

```bash
npm run prisma:generate
```

Run Migration

```bash
npm run prisma:migrate
```

Open Prisma Studio

```bash
npm run prisma:studio
```

---

# Run Project

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

# Stripe Webhook

Run Stripe Listener

```bash
npm run stripe:webhook
```

Webhook Route

```
POST /api/payments/confirm
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/users/me |

---

## Categories

| Method | Endpoint |
|---------|----------|
| POST | /api/categories/create |
| GET | /api/categories/all |
| GET | /api/categories/:id |
<!-- | PATCH | /api/categories/update/:id |
| DELETE | /api/categories/delete/:id | -->

---

## Technician Profile

| Method | Endpoint |
|---------|----------|
| POST | /api/technician-profile/create |
| PATCH | /api/technician-profile/update-profile |
| GET | /api/technician-profile/my-profile |
| GET | /api/technician-profile/all |
| GET | /api/technician-profile/:id |

---

## Services

| Method | Endpoint |
|---------|----------|
| POST | /api/services/create |
| GET | /api/services/all |
| GET | /api/services/:id |
| PATCH | /api/services/update/:id |
| DELETE | /api/services/delete/:id |

---

## Bookings

| Method | Endpoint |
|---------|----------|
| POST | /api/bookings/create |
| GET | /api/bookings/my-bookings |
| GET | /api/bookings/all-bookings |
| GET | /api/bookings/technician-bookings |
| GET | /api/bookings/:id |
| PATCH | /api/bookings/update-status/:id |
| PATCH | /api/bookings/:/cancel |
| DELETE | /api/bookings/:id |

---

## Payments

| Method | Endpoint |
|---------|----------|
| POST | /api/payments/create-checkout-session/:bookingId |
| POST | /api/payments/confirm |
| GET | /api/payments |
| GET | /api/payments/:id |

---

## Reviews

| Method | Endpoint |
|---------|----------|
| POST | /api/reviews/create |
| GET | /api/reviews/all |
| GET | /api/reviews/:id |
| DELETE | /api/reviews/delete/:id |

---

## Users (Admin)

| Method | Endpoint |
|---------|----------|
| GET | /api/users/all-users |
| PATCH | /api/users/status/:id |
| PATCH | /api/users/:id/role |

---

# Role Permissions

## Customer

- Register
- Login
- Book Services
- Make Payments
- Submit Reviews
- View Own Bookings
- View Own Payments

## Technician

- Manage Profile
- Manage Services
- Manage Availability
- Accept / Decline Bookings
- Complete Services

## Admin

- Manage Users
- Manage Categories
- Manage Bookings
- Manage Payments
- Manage Reviews

---

# Validation & Security

- JWT Authentication
- Role Based Authorization
- Password Hashing (bcrypt)
- Request Validation
- Global Error Handling
- Prisma ORM
- Stripe Webhook Verification

---

# Technical Challenges

- Prevented double bookings by checking technician availability and existing bookings.
- Implemented secure Stripe payment flow using webhook verification.
- Built modular architecture for scalability and maintainability.

---

# Author

**Md Sumon Khan**


LinkedIn:
https://www.linkedin.com/in/sumoncodes/