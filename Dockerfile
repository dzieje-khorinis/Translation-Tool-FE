FROM node:16.2-stretch

WORKDIR /usr/src/app

COPY package*.json ./

RUN NODE_ENV=development npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=0 /usr/src/app/build /usr/share/nginx/html
COPY --from=0 /usr/src/app/default.conf /etc/nginx/conf.d/default.conf
