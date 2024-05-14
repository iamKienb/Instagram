FROM node:latest


WORKDIR /app/follow_service

COPY package*.json ./



RUN npm install 


COPY . .

EXPOSE 8004

CMD [ "npm", "run", "dev" ]