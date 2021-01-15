FROM node:alpine

WORKDIR /adaptor
ADD . .

ENV PORT=8081

RUN npm install
ENTRYPOINT ["./node_modules/.bin/nodemon", "server.js"]
