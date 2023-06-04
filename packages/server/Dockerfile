FROM node:16-alpine

WORKDIR /app/server

COPY /package*.json ./

RUN npm install --production

COPY dist/ ./dist

EXPOSE 3000

RUN npm install pm2 -g

CMD [ "pm2-runtime", "npm", "--", "run", "start:prod" ]
