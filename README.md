# 🛍️ Vynex Premium

A modern full-stack e-commerce platform built with **React, Vite, Node.js, Express, and MongoDB**.

Vynex provides a complete shopping experience with authentication, email OTP verification, product management, cart and wishlist functionality, order management, admin controls, JWT authentication, and encrypted customer information.

---

## ✨ Features

### 👤 User Features

* User registration and login
* Email OTP verification
* JWT-based authentication
* User profile management
* Product browsing
* Product search
* Category filtering
* Price filtering
* Size filtering
* Shopping cart
* Wishlist
* Product details
* Order placement
* Order history
* Responsive UI

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Product management
* Add products
* Edit products
* Delete products
* Stock management
* Order management
* Update order status
* Update payment status
* View customer orders
* Product/category statistics

### 🔐 Security

* JWT authentication
* Password hashing with bcrypt
* AES-256-GCM encryption for sensitive order information
* Environment variables for secrets
* Protected admin routes
* OTP-based email verification

---

# 🧰 Tech Stack

## Frontend

* React 19
* Vite
* React Router
* React Bootstrap
* React Icons
* React Toastify
* JavaScript
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer
* dotenv
* CORS

---

# 📁 Project Structure

```text
Vynex/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── products.js
│   └── ...
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── test-crypto.js
│
├── public/
├── package.json
├── vite.config.js
├── .gitignore
├── .env.example
└── README.md
```

---

# 🚀 Getting Started

Follow the steps below to run Vynex locally.

---

## 1. Prerequisites

Make sure the following are installed on your computer:

* **Node.js** 18+
* **npm**
* **MongoDB**

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check MongoDB:

```bash
mongosh
```

If you don't want to install MongoDB locally, you can use **MongoDB Atlas** instead.

---

# 📥 2. Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Then enter the project:

```bash
cd YOUR_REPOSITORY
```

> Replace `YOUR_USERNAME/YOUR_REPOSITORY` with your actual GitHub repository.

---

# 📦 3. Install Frontend Dependencies

From the project root:

```bash
npm install
```

This installs all React/Vite frontend dependencies.

---

# ⚙️ 4. Install Backend Dependencies

Move into the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Then return to the project root:

```bash
cd ..
```

---

# 🔑 5. Configure Environment Variables

The backend requires environment variables for MongoDB, JWT authentication, encryption, and SMTP email verification.

Create a `.env` file inside the `server` folder:

```text
server/
├── .env
├── index.js
├── package.json
└── ...
```

Your `.env` should look like:

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET=your_jwt_secret_here

ENCRYPTION_KEY=your_32_byte_encryption_key_here

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password_here
```

---

# 📄 Environment Variables Explained

| Variable         | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `PORT`           | Port used by the Express backend                        |
| `MONGODB_URI`    | MongoDB database connection string                      |
| `JWT_SECRET`     | Secret used to sign JWT authentication tokens           |
| `ENCRYPTION_KEY` | 32-byte hexadecimal key used for AES-256-GCM encryption |
| `SMTP_HOST`      | SMTP mail server                                        |
| `SMTP_PORT`      | SMTP server port                                        |
| `SMTP_USER`      | Email address used to send OTPs                         |
| `SMTP_PASS`      | Gmail App Password                                      |

---

# 📋 6. Using `.env.example`

The repository contains an `.env.example` file.

Copy it to `.env`.

### Windows

```bash
copy server\.env.example server\.env
```

### macOS / Linux

```bash
cp server/.env.example server/.env
```

Then edit:

```text
server/.env
```

and replace the placeholder values with your actual configuration.

---

# 📧 7. Configure Gmail OTP

Vynex uses **Nodemailer** to send OTP verification emails.

For Gmail, you should use a **Google App Password**, not your normal Gmail password.

Configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

If SMTP is not configured, Vynex can fall back to displaying the OTP in the backend console during development.

---

# 🗄️ 8. Configure MongoDB

## Option A — Local MongoDB

Start MongoDB on your computer.

Then use:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

The application will use the `ecommerce` database.

---

## Option B — MongoDB Atlas

Create a MongoDB Atlas cluster and obtain your connection string.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ecommerce
```

Replace:

```text
USERNAME
PASSWORD
cluster.mongodb.net
```

with your actual MongoDB Atlas details.

---

# ▶️ 9. Run the Backend

Open a terminal in the project root:

```bash
cd server
```

Start the backend:

```bash
npm start
```

You should see something similar to:

```text
VYNEX PREMIUM SERVER RUNNING ON PORT 5000
Environment: development
```

The API will be available at:

```text
http://localhost:5000
```

---

# ❤️ 10. Check Backend Health

Open:

```text
http://localhost:5000/api/health
```

You should receive:

```json
{
  "status": "healthy",
  "message": "Vynex Premium E-Commerce API is running smoothly."
}
```

If you see this response, your backend is running correctly.

---

# 💻 11. Run the Frontend

Open a **second terminal**.

From the project root:

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🏃 Running the Complete Application

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd server
npm install
npm start
```

### Terminal 2 — Frontend

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔐 Authentication Flow

Vynex authentication works approximately as follows:

```text
User
 │
 ├── Register
 │
 ▼
Email OTP
 │
 ▼
OTP Verification
 │
 ▼
Account Created
 │
 ▼
JWT Token
 │
 ▼
Authenticated User
```

Login:

```text
Email + Password
       │
       ▼
Backend Authentication
       │
       ▼
Password Verification
       │
       ▼
JWT Token
       │
       ▼
Authenticated Session
```

---

# 🛒 Shopping Flow

A typical shopping flow is:

```text
Browse Products
       │
       ▼
Search / Filter
       │
       ▼
Product Details
       │
       ├──── Add to Wishlist
       │
       └──── Add to Cart
                  │
                  ▼
              Cart
                  │
                  ▼
              Checkout
                  │
                  ▼
             Place Order
                  │
                  ▼
            Order History
```

---

# 👨‍💼 Admin Flow

Admin users can manage products and orders.

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├── Products
     │     ├── Add
     │     ├── Edit
     │     └── Delete
     │
     └── Orders
           ├── View
           ├── Update Order Status
           └── Update Payment Status
```

---

# 🧪 Security Test

The backend includes a security test for:

* AES-256-GCM encryption/decryption
* bcrypt password hashing
* Password verification

Run:

```bash
cd server
node test-crypto.js
```

A successful test should report that the encryption and password hashing tests passed.

---

# 🏗️ Build for Production

Build the frontend:

```bash
npm run build
```

The production frontend will be generated inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# 🔍 Lint the Frontend

Run:

```bash
npm run lint
```

This checks the frontend code using ESLint.

---

# 🌐 API Endpoints

## Authentication

```text
POST /api/auth/send-otp
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Categories

```text
GET /api/categories
```

## Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/admin
PUT  /api/orders/admin/:id/status
```

## Health Check

```text
GET /api/health
```

---

# 🧹 Important Git Files

Do **not** commit your real environment file.

Your repository should contain:

```text
.env.example
```

but should **not** contain:

```text
.env
```

Your `.gitignore` should include:

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
```

If `.env` was previously tracked by Git:

```bash
git rm --cached server/.env
git add .gitignore
git commit -m "Remove environment variables from Git tracking"
git push
```

---

# ⚠️ Common Problems

## MongoDB Connection Error

Check:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

Make sure MongoDB is running.

For MongoDB Atlas, verify:

* Username
* Password
* Connection string
* Network access
* Database user permissions

---

## OTP Email Not Sending

Check:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

For Gmail, use an **App Password**.

If SMTP is unavailable during development, check the backend terminal for the fallback OTP.

---

## Frontend Cannot Connect to Backend

Make sure the backend is running:

```bash
cd server
npm start
```

Then verify:

```text
http://localhost:5000/api/health
```

The frontend currently communicates with:

```text
http://localhost:5000/api
```

---

## Port Already in Use

If port `5000` is already being used, change:

```env
PORT=5001
```

However, make sure the frontend API URL is updated accordingly.

---

# 🔒 Security Notes

Never commit:

* `.env`
* MongoDB passwords
* JWT secrets
* Encryption keys
* SMTP passwords
* API keys

Use:

```text
.env.example
```

for sharing configuration structure.

If a secret has accidentally been pushed to GitHub, **rotate the secret immediately**. Simply deleting the file from the latest commit does not remove it from Git history.

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Create a branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

### 4. Commit

```bash
git add .
git commit -m "Add your feature"
```

### 5. Push

```bash
git push origin feature/your-feature
```

### 6. Create a Pull Request

---

# 📜 License

This project is intended for educational and development purposes.

Add your preferred license here if you plan to distribute the project publicly.

---

# 👨‍💻 Author

**Manikandan A.**

Computer Science & Engineering Student

Built with ❤️ using React, Node.js, Express and MongoDB.

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

**Vynex — Shop Smarter. Shop Better.**
# 🛍️ Vynex Premium

A modern full-stack e-commerce platform built with **React, Vite, Node.js, Express, and MongoDB**.

Vynex provides a complete shopping experience with authentication, email OTP verification, product management, cart and wishlist functionality, order management, admin controls, JWT authentication, and encrypted customer information.

---

## ✨ Features

### 👤 User Features

* User registration and login
* Email OTP verification
* JWT-based authentication
* User profile management
* Product browsing
* Product search
* Category filtering
* Price filtering
* Size filtering
* Shopping cart
* Wishlist
* Product details
* Order placement
* Order history
* Responsive UI

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Product management
* Add products
* Edit products
* Delete products
* Stock management
* Order management
* Update order status
* Update payment status
* View customer orders
* Product/category statistics

### 🔐 Security

* JWT authentication
* Password hashing with bcrypt
* AES-256-GCM encryption for sensitive order information
* Environment variables for secrets
* Protected admin routes
* OTP-based email verification

---

# 🧰 Tech Stack

## Frontend

* React 19
* Vite
* React Router
* React Bootstrap
* React Icons
* React Toastify
* JavaScript
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer
* dotenv
* CORS

---

# 📁 Project Structure

```text
Vynex/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── products.js
│   └── ...
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── test-crypto.js
│
├── public/
├── package.json
├── vite.config.js
├── .gitignore
├── .env.example
└── README.md
```

---

# 🚀 Getting Started

Follow the steps below to run Vynex locally.

---

## 1. Prerequisites

Make sure the following are installed on your computer:

* **Node.js** 18+
* **npm**
* **MongoDB**

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check MongoDB:

```bash
mongosh
```

If you don't want to install MongoDB locally, you can use **MongoDB Atlas** instead.

---

# 📥 2. Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Then enter the project:

```bash
cd YOUR_REPOSITORY
```

> Replace `YOUR_USERNAME/YOUR_REPOSITORY` with your actual GitHub repository.

---

# 📦 3. Install Frontend Dependencies

From the project root:

```bash
npm install
```

This installs all React/Vite frontend dependencies.

---

# ⚙️ 4. Install Backend Dependencies

Move into the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Then return to the project root:

```bash
cd ..
```

---

# 🔑 5. Configure Environment Variables

The backend requires environment variables for MongoDB, JWT authentication, encryption, and SMTP email verification.

Create a `.env` file inside the `server` folder:

```text
server/
├── .env
├── index.js
├── package.json
└── ...
```

Your `.env` should look like:

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET=your_jwt_secret_here

ENCRYPTION_KEY=your_32_byte_encryption_key_here

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password_here
```

---

# 📄 Environment Variables Explained

| Variable         | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `PORT`           | Port used by the Express backend                        |
| `MONGODB_URI`    | MongoDB database connection string                      |
| `JWT_SECRET`     | Secret used to sign JWT authentication tokens           |
| `ENCRYPTION_KEY` | 32-byte hexadecimal key used for AES-256-GCM encryption |
| `SMTP_HOST`      | SMTP mail server                                        |
| `SMTP_PORT`      | SMTP server port                                        |
| `SMTP_USER`      | Email address used to send OTPs                         |
| `SMTP_PASS`      | Gmail App Password                                      |

---

# 📋 6. Using `.env.example`

The repository contains an `.env.example` file.

Copy it to `.env`.

### Windows

```bash
copy server\.env.example server\.env
```

### macOS / Linux

```bash
cp server/.env.example server/.env
```

Then edit:

```text
server/.env
```

and replace the placeholder values with your actual configuration.

---

# 📧 7. Configure Gmail OTP

Vynex uses **Nodemailer** to send OTP verification emails.

For Gmail, you should use a **Google App Password**, not your normal Gmail password.

Configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

If SMTP is not configured, Vynex can fall back to displaying the OTP in the backend console during development.

---

# 🗄️ 8. Configure MongoDB

## Option A — Local MongoDB

Start MongoDB on your computer.

Then use:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

The application will use the `ecommerce` database.

---

## Option B — MongoDB Atlas

Create a MongoDB Atlas cluster and obtain your connection string.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ecommerce
```

Replace:

```text
USERNAME
PASSWORD
cluster.mongodb.net
```

with your actual MongoDB Atlas details.

---

# ▶️ 9. Run the Backend

Open a terminal in the project root:

```bash
cd server
```

Start the backend:

```bash
npm start
```

You should see something similar to:

```text
VYNEX PREMIUM SERVER RUNNING ON PORT 5000
Environment: development
```

The API will be available at:

```text
http://localhost:5000
```

---

# ❤️ 10. Check Backend Health

Open:

```text
http://localhost:5000/api/health
```

You should receive:

```json
{
  "status": "healthy",
  "message": "Vynex Premium E-Commerce API is running smoothly."
}
```

If you see this response, your backend is running correctly.

---

# 💻 11. Run the Frontend

Open a **second terminal**.

From the project root:

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🏃 Running the Complete Application

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd server
npm install
npm start
```

### Terminal 2 — Frontend

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔐 Authentication Flow

Vynex authentication works approximately as follows:

```text
User
 │
 ├── Register
 │
 ▼
Email OTP
 │
 ▼
OTP Verification
 │
 ▼
Account Created
 │
 ▼
JWT Token
 │
 ▼
Authenticated User
```

Login:

```text
Email + Password
       │
       ▼
Backend Authentication
       │
       ▼
Password Verification
       │
       ▼
JWT Token
       │
       ▼
Authenticated Session
```

---

# 🛒 Shopping Flow

A typical shopping flow is:

```text
Browse Products
       │
       ▼
Search / Filter
       │
       ▼
Product Details
       │
       ├──── Add to Wishlist
       │
       └──── Add to Cart
                  │
                  ▼
              Cart
                  │
                  ▼
              Checkout
                  │
                  ▼
             Place Order
                  │
                  ▼
            Order History
```

---

# 👨‍💼 Admin Flow

Admin users can manage products and orders.

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├── Products
     │     ├── Add
     │     ├── Edit
     │     └── Delete
     │
     └── Orders
           ├── View
           ├── Update Order Status
           └── Update Payment Status
```

---

# 🧪 Security Test

The backend includes a security test for:

* AES-256-GCM encryption/decryption
* bcrypt password hashing
* Password verification

Run:

```bash
cd server
node test-crypto.js
```

A successful test should report that the encryption and password hashing tests passed.

---

# 🏗️ Build for Production

Build the frontend:

```bash
npm run build
```

The production frontend will be generated inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# 🔍 Lint the Frontend

Run:

```bash
npm run lint
```

This checks the frontend code using ESLint.

---

# 🌐 API Endpoints

## Authentication

```text
POST /api/auth/send-otp
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Categories

```text
GET /api/categories
```

## Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/admin
PUT  /api/orders/admin/:id/status
```

## Health Check

```text
GET /api/health
```

---

# 🧹 Important Git Files

Do **not** commit your real environment file.

Your repository should contain:

```text
.env.example
```

but should **not** contain:

```text
.env
```

Your `.gitignore` should include:

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
```

If `.env` was previously tracked by Git:

```bash
git rm --cached server/.env
git add .gitignore
git commit -m "Remove environment variables from Git tracking"
git push
```

---

# ⚠️ Common Problems

## MongoDB Connection Error

Check:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

Make sure MongoDB is running.

For MongoDB Atlas, verify:

* Username
* Password
* Connection string
* Network access
* Database user permissions

---

## OTP Email Not Sending

Check:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

For Gmail, use an **App Password**.

If SMTP is unavailable during development, check the backend terminal for the fallback OTP.

---

## Frontend Cannot Connect to Backend

Make sure the backend is running:

```bash
cd server
npm start
```

Then verify:

```text
http://localhost:5000/api/health
```

The frontend currently communicates with:

```text
http://localhost:5000/api
```

---

## Port Already in Use

If port `5000` is already being used, change:

```env
PORT=5001
```

However, make sure the frontend API URL is updated accordingly.

---

# 🔒 Security Notes

Never commit:

* `.env`
* MongoDB passwords
* JWT secrets
* Encryption keys
* SMTP passwords
* API keys

Use:

```text
.env.example
```

for sharing configuration structure.

If a secret has accidentally been pushed to GitHub, **rotate the secret immediately**. Simply deleting the file from the latest commit does not remove it from Git history.

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Create a branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

### 4. Commit

```bash
git add .
git commit -m "Add your feature"
```

### 5. Push

```bash
git push origin feature/your-feature
```

### 6. Create a Pull Request

---

# 📜 License

This project is intended for educational and development purposes.

Add your preferred license here if you plan to distribute the project publicly.

---

# 👨‍💻 Author

**Manikandan A.**

Computer Science & Engineering Student

Built with ❤️ using React, Node.js, Express and MongoDB.

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

**Vynex — Shop Smarter. Shop Better.**
