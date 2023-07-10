FROM python:alpine

RUN apk update && apk add ruby && apk add nodejs npm

WORKDIR /app

COPY /packages/server/package*.json ./

COPY /packages/server/dist/ ./

COPY /packages/client/dist/ ./client

RUN pnpm install --production

EXPOSE 3000

RUN npm install pm2 -g

CMD ["pm2-runtime", "npm", "--", "start"]
