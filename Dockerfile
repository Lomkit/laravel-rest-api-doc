FROM node:alpine

WORKDIR /frontend

RUN apk update && apk upgrade
RUN apk add git

COPY ./package*.json /frontend/

RUN npm install --include=dev && npm cache clean --force

COPY . .

ENV PATH ./node_modules/.bin/:$PATH