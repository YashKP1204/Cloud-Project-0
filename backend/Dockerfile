# Use the official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the app port
EXPOSE 5000

# Start the app with nodemon for development
CMD ["npm", "run", "dev"]
