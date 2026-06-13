FROM node:24.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# technically api url should be its name, but you get me ..
ARG VITE_BACKEND_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

