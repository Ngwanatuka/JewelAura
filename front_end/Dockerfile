FROM node:18-alpine

LABEL org.opencontainers.image.source=https://github.com/Ngwanatuka/JewelAura
LABEL org.opencontainers.image.description="JewelAura Frontend React App"

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "--no-open"]