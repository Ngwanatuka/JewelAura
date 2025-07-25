# JewelAura Testing Guide

## Test Coverage

### Backend Tests (`/api/__tests__/`)
- **Authentication Tests** (`auth.test.js`)
  - User registration with validation
  - User login with JWT token generation
  - Error handling for invalid credentials

- **Product API Tests** (`product.test.js`)
  - Get all products
  - Filter products by category
  - Get product by ID
  - Error handling for invalid requests

- **Model Tests** (`models.test.js`)
  - User model validation and constraints
  - Product model schema validation
  - Database relationship testing

- **Health Check Tests** (`health.test.js`)
  - API health endpoint validation

### Frontend Tests (`/front_end/src/`)
- **Component Tests** (`components/__tests__/`)
  - Navbar component rendering and interactions
  - Navigation link functionality
  - Cart badge display

- **Redux Tests** (`redux/__tests__/`)
  - Cart state management
  - Add/remove/update product actions
  - State persistence and calculations

- **Page Tests** (`pages/__tests__/`)
  - Login form validation
  - User input handling
  - Error state display

## Running Tests

### Local Testing
```bash
# Run all tests
./test-runner.js

# Backend only
cd api && npm test

# Frontend only
cd front_end && npm test

# Watch mode (frontend)
cd front_end && npm run test:ui
```

### CI/CD Pipeline
Tests run automatically on:
- Every push to main/develop branches
- Pull requests to main branch

### Test Technologies
- **Backend**: Jest, Supertest, MongoDB Memory Server
- **Frontend**: Vitest, React Testing Library, Jest DOM

## Test Structure
- Unit tests for individual functions/components
- Integration tests for API endpoints
- Redux state management tests
- Component interaction tests

## Coverage Goals
- Minimum 80% code coverage
- All critical user flows tested
- Error scenarios covered
- Authentication and authorization tested