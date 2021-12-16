FROM node:12.18.1
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN npm i -g pm2
COPY . .

EXPOSE 80
CMD ["pm2", "start", "index"]