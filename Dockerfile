FROM node:latest
ENV CI=true
RUN corepack enable pnpm

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
COPY . .

RUN pnpm i
RUN pnpm build

CMD ["pnpm", "start"]
