FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 443
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/is-tool.cer /etc/nginx/bundle.crt
COPY ./nginx/server.key /etc/nginx/is-tool.key
COPY --from=builder /app/build /usr/share/nginx/html