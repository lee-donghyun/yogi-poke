FROM node:18-alpine

WORKDIR /usr/src/app

COPY . ./

RUN corepack enable pnpm
RUN pnpm i

EXPOSE 708

CMD ["npm", "run", "start"]
