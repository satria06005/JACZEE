# Gunakan image Node.js versi 20 (versi yang stabil dan umum digunakan)
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada) terlebih dahulu
# Ini dilakukan agar Docker dapat melakukan cache pada langkah instalasi dependensi
COPY package.json package-lock.json* ./

# Install system dependencies that might be needed for Prisma and other native modules
RUN apk add --no-cache libc6-compat openssl python3 make g++

# Install dependensi (Gunakan --legacy-peer-deps untuk mengatasi konflik versi React 19)
RUN npm install --legacy-peer-deps

# Salin seluruh file proyek ke dalam container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build aplikasi Next.js (menghasilkan folder .next)
RUN npm run build

# Ekspos port 3000 (port standar Next.js)
EXPOSE 3000

# Perintah yang akan dijalankan saat container dihidupkan
CMD ["npm", "start"]
