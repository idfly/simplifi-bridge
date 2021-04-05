FROM node:12.19.0

COPY ./build/contracts/ ./adapterdgu/src/abi
WORKDIR /adapterdgu
ADD ./adapter/adapterdgu .



RUN npm install
EXPOSE ${PORT}
ENTRYPOINT ["./node_modules/.bin/nodemon", "./src/index.js"]
