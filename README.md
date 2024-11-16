# Authentication System

This is an authentication system that supports both **passwordless (OTP-based)** login and **password-based** login. The system is built using modern frameworks and tools to ensure security, efficiency, and scalability.

---

## Features

- **Passwordless Login (OTP)**:
  - Email OTP using **Nodemailer**.
  - Mobile OTP using **Twilio**.
- **Password-based Login**:
  - Secure password management.
- **In-memory Caching and Verification**:
  - Implemented using **Redis** for fast and reliable OTP storage and validation.
- **User Data Storage**:
  - Persistent storage using **MongoDB** for user data.
- **Session Management**:
  - **JWT** (JSON Web Tokens) for securely caching login credentials in the browser.

---

## Tech Stack

- **Node.js**: Runtime environment for the backend.
- **Express.js**: Framework for building the server.
- **MongoDB**: Database for storing user information.
- **Redis**: For caching and in-memory storage.
- **Nodemailer**: For sending OTPs via email.
- **Twilio**: For sending OTPs via SMS.
- **JWT.io**: For managing session tokens.

---

## Installation

1. Clone the repository:
   ```bash
   https://github.com/Rishabh-J08/hybrid-authSystem.git
   cd hybrid-authSystem
