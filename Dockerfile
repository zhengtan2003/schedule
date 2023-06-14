FROM node:16-alpine

WORKDIR /app

COPY /packages/server/package*.json ./

COPY /packages/server/dist/ ./

COPY /packages/client/dist/ ./client

RUN npm install --production

EXPOSE 3000

RUN npm install pm2 -g

CMD ["pm2-runtime", "npm", "--", "start"]
