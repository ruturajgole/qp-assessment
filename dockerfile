# Use a Debian base image
FROM debian:buster

# Install dependencies (such as curl and build tools)
RUN apt-get update && apt-get install -y curl && apt-get clean

# Install Node.js version 20.12.2
RUN curl -o node-v20.12.2-linux-x64.tar.gz https://nodejs.org/dist/v20.12.2/node-v20.12.2-linux-x64.tar.gz \
    && tar -xf node-v20.12.2-linux-x64.tar.gz \
    && mv node-v20.12.2-linux-x64 /usr/local/nodejs \
    && rm node-v20.12.2-linux-x64.tar.gz

# Add Node.js binaries to PATH
ENV PATH="/usr/local/nodejs/bin:${PATH}"

# Verify installation
RUN node --version && npm --version

# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
