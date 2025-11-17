# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the application
COPY . .
RUN npm run build

# The built files will be in /app/../backend/src/main/resources/static
# This is because of the outDir setting in vite.config.ts
# No need for a second stage since we're using Spring Boot to serve the files
