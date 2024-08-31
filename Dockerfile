FROM node:22.7.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g typescript
RUN npx tsc
EXPOSE 80
CMD ["npm", "run", "start"]