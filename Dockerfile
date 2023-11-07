FROM node:18

WORKDIR /

COPY ./src .
COPY package.json .
COPY package-lock.json .

RUN npm install

CMD ["npm", "run", "start"]