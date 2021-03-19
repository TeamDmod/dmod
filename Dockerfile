FROM node:14

COPY ./server/ /backend/

WORKDIR /backend/

RUN npm install

EXPOSE 4000

CMD ["node", "index.js"]