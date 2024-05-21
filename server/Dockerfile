FROM node:18-alpine

WORKDIR /usr/src/app

COPY . ./
RUN rm .env.dev

RUN corepack enable pnpm
RUN pnpm i

RUN npm run build
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "start"]
