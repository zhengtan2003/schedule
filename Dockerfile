FROM node:18-alpine
RUN npm i -g pnpm pm2
WORKDIR /usr/src/app

COPY /packages/server/ .
COPY /packages/client/dist/ ./client

RUN pnpm install
RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD ["pm2-runtime", "npm", "--", "start"]
