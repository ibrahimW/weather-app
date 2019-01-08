FROM node:10.15

COPY . /src/app

WORKDIR /src/app

RUN npm ci

CMD npm start
