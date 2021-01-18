FROM node:12.19.0

WORKDIR /adaptordgu
ADD . .


RUN npm install
ENTRYPOINT ["./node_modules/.bin/nodemon", "./src/index.js"]
