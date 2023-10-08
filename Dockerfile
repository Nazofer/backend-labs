FROM node

WORKDIR /

COPY ./src .
COPY package.json .
COPY package-lock.json .
COPY .env .

RUN npm install

CMD ["npm", "run", "dev"]