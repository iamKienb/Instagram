
# Instagram Microservice Backend

## Overview
This project implements a microservice architecture for a simplified Instagram backend using Node.js. The system leverages various technologies including Docker, Kafka, and NGINX as a reverse proxy to handle microservices communications efficiently.

## Technologies
- Node.js with Express: For building fast and scalable server-side applications.
- **TypeScript**: Adds static type definitions to JavaScript.
- **Docker**: For containerizing the microservices.
- **Express**: Web application framework for Node.js.
- **NGINX (Reverse Proxy)**: For routing requests to appropriate microservices.
- **Kafka**: For handling message queues across different services.
- **Multer with Cloudinary**: For handling file uploads and image management.
- **REST API**: Standard protocol for web services.
- **TypeORM with PostgreSQL**: For object-relational mapping and database management.

## Microservices
### User Service
- **Technologies**: Node.js, Express, JSON Web Token (JWT), TypeORM, PostgreSQL
- **Features**:
  - User authentication and authorization.
  - CRUD operations for user management.

### Feeds Service
- **Features**:
  - Like, share, and comment on posts.
  - Handles user interactions with posts.

### Stories Service
- **Features**:
  - Like and comment on stories.
  - Manages user interactions with stories.

### Follow Service
- **Features**:
  - Manages user relationships and follow functionalities.

### Chat Service
- **Features**:
  - Manages and stores messages between users.

## Deployment
All services are containerized using Docker and are interconnected through Kafka. The entry point for the services is an NGINX reverse proxy, which routes requests to the appropriate services.

## Getting Started
To get the project up and running on your local machine for development and testing purposes, follow these steps:

1. **Clone the repository:**
   ```
   git clone https://github.com/iamKienb/Instagram.git
   ```
2. **Build the Docker containers:**
   ```
   docker-compose up --build
   ```


