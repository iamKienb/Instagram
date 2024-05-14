FROM node:latest


WORKDIR /app/chat_service

COPY package*.json ./



RUN npm install 


COPY . .

EXPOSE 8005

CMD [ "npm", "run", "dev" ]