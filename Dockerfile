FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

RUN rm -rf ./src

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
