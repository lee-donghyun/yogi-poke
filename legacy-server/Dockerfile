FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm i

COPY . ./
RUN npm run build
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "start"]
