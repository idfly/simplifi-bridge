FROM node:alpine
WORKDIR /app
RUN npm install -g ganache-cli
CMD ["ganache-cli", "-h", "0.0.0.0", "-p", "7545", "-e", "10000", "-l", "2086062308", "-i", "1337"]