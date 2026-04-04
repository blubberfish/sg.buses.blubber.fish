FROM node:lts-bookworm

WORKDIR /app

# Install Debian build tools.
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
	&& rm -rf /var/lib/apt/lists/*

# COPY package*.json ./
# RUN npm ci

# COPY . .

