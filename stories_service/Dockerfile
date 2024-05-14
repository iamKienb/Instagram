FROM node:latest


WORKDIR /app/stories_service

COPY package*.json ./



RUN npm install 


COPY . .

EXPOSE 8003

CMD [ "npm", "run", "dev" ]