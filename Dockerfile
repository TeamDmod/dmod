FROM node:14

COPY ./server/ /app/

WORKDIR /app/

RUN npm install

EXPOSE 4000

CMD [ "node", "index.js" ]