FROM mcr.microsoft.com/playwright:v1.43.1-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV API_BASE_URL=https://jsonplaceholder.typicode.com
ENV LOG_LEVEL=info

CMD ["npm", "test"]
