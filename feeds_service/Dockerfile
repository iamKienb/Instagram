FROM node:latest


WORKDIR /app/feeds_service

COPY package*.json ./

RUN npm install 


COPY . .

EXPOSE 8002

CMD [ "npm", "run", "dev" ]