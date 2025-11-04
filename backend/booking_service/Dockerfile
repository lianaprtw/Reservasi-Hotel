# Gunakan image Node.js resmi versi ringan
FROM node:20-alpine AS build

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi (tanpa devDependencies)
RUN npm ci --omit=dev

# Salin seluruh source code ke dalam container
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Buka port (ubah jika di .env berbeda)
EXPOSE 3001

# Jalankan aplikasi
# GANTI "npm" MENJADI "node"
CMD ["npm", "start"]

