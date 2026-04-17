# Authentication System - Complete ✅

The Adryx platform has a fully functional authentication system supporting both traditional email/password and Web3 wallet-based authentication.

## Features

### ✅ Implemented Features

1. **Email/Password Authentication**
   - User registration with email and password
   - Secure password hashing with bcrypt
   - JWT token-based authentication
   - Access tokens (1 hour expiry)
   - Refresh tokens (7 days expiry)

2. **Wallet Authentication**
   - Solana wallet signature verification
   - Automatic user creation on first wallet login
   - Message signing for authentication
   - Support for all Solana wallet adapters

3. **User Roles**
   - Advertiser role
   - Publisher role
   - Admin role (reserved for future use)

4. **Security Features**
   - Password hashing with bcryptjs
   - JWT token validation
   - Signature verification for wallet auth
   - Protected routes with guards
   - Token refresh mechanism

## API Endpoints

### Base URL
```
http://localhost:3001/api/v1/auth
```

### 1. Register (POST /auth/register)

Create a new user account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "advertiser",
  "walletAddress": "optional-wallet-address"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "advertiser",
    "walletAddress": "optional-wallet-address",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2026-04-17T15:00:00.000Z",
    "updatedAt": "2026-04-17T15:00:00.000Z"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Minimum 8 characters
- Name: Minimum 2 characters
- Role: Must be 'advertiser' or 'publisher'
- WalletAddress: Optional, must be unique if provided

### 2. Login (POST /auth/login)

Authenticate with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { /* user object */ },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### 3. Wallet Login (POST /auth/wallet-login)

Authenticate using Solana wallet signature.

**Request Body:**
```json
{
  "walletAddress": "solana-public-key",
  "signature": "base58-encoded-signature",
  "message": "Sign this message to authenticate..."
}
```

**Response:**
```json
{
  "user": { /* user object */ },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

**How it works:**
1. Frontend generates a message with wallet address and timestamp
2. User signs the message with their wallet
3. Backend verifies the signature using Solana's nacl library
4. If valid, user is authenticated (created if doesn't exist)

### 4. Get Profile (GET /auth/me)

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**