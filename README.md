# JewelAura - E-commerce Project

Welcome to Glittering Rock Jewelles, an e-commerce project that combines a sleek React.js front end with a robust Express.js backend. This project allows users to browse and purchase stunning jewelry while utilizing modern technologies such as Stripe for payment processing, Redux for state management, and Axios for efficient API calls.

## Table of Contents

1. Project Overview
2. Installation
3. Running the Project
4. Technologies Used
5. Development Guidelines
6. Docker Deployment
7. File Structure
8. Backend configuration
9. Frontend configuration


## Project Overview

Glittering Rock Jewelles is an e-commerce platform designed to provide users with a seamless shopping experience for high-quality jewelry. The project is divided into two main parts:

* **Backend**: The server-side logic is built using Express.js and Node.js, incorporating JWT for secure authentication. The backend exposes APIs for managing products, user authentication, and processing orders.
* **Frontend**: The user interface is developed using React.js, featuring Redux for state management, React Routing for smooth navigation, and Axios for handling API requests. The payment gateway is implemented through Stripe for secure and reliable transactions.

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/glittering-rock-jewelles.git
    ```

2. Navigate to the project directory
    ```bash
    cd glittering-rock-jewelles
    ```
3. Install dependencies for both the backend and frontend:
    ```bash
    npm install
    ```

## Running the Project
**Backend**: To start the server, run the following command:
```bash
npm start
```
The server will start on port 5000 by default.

**Frontend**: To start the React app, run the following command:
```bash
npm run dev
```
The app will start on port 3000 by default.


## Technologies Used

* **Backend**: 
  * Express.js 
  * Node.js 
  * MongoDB 
  * Mongoose 
  * JWT
  * Dotenv
* **Frontend**
  * React Vite
  * Redux
  * React Router
  * Axios
  * Stripe
  * Styled Components

## Development Guidelines

### Test-Driven Development (TDD)
All new features must follow TDD methodology:
1. **Red**: Write failing tests first
2. **Green**: Write minimal code to make tests pass
3. **Refactor**: Improve code while keeping tests green

### Testing Requirements
- Backend: Jest with Supertest for API testing
- Frontend: Vitest with React Testing Library
- All tests must pass before merging to main branch
- Minimum test coverage for new features

## Docker Deployment

### Build Images
**Windows:**
```bash
.\build-images.bat
```

**Linux/macOS:**
```bash
chmod +x build-images.sh
./build-images.sh
```

### Run with Docker Compose
**Development:**
```bash
docker-compose up
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up
```