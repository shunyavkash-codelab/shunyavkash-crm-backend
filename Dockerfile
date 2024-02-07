# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /Users/macmini3/Sites/CRM/api-crm/app.js

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 4001

# Command to run your application
CMD ["npm", "start"]
