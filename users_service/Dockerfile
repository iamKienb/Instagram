FROM node:latest


WORKDIR /app/users_service

COPY package*.json ./



RUN npm install 


COPY . .

EXPOSE 8001

CMD [ "npm", "run", "dev" ]