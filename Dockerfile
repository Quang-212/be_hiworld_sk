FROM node:16-alpine

WORKDIR /var/service/app

ADD package*.json ./

RUN yarn
RUN yarn add node-pre-gyp

ADD . .

EXPOSE 3040

CMD yarn dev

