# Sử dụng Node.js làm base image
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 5173 cho Vite
EXPOSE 5173

# Lệnh mặc định để chạy khi container khởi động
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
