FROM node:18-alpine

LABEL org.opencontainers.image.source=https://github.com/Ngwanatuka/JewelAura
LABEL org.opencontainers.image.description="JewelAura Backend API"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]