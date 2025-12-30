# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for nodemon)
RUN npm ci

# Copy application files
COPY . .


# Expose the port your app runs on
EXPOSE 4506

# Start the application with nodemon
CMD ["npm", "run", "dev"]