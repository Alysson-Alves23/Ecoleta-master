FROM node:24-alpine AS build

WORKDIR /app

# Dependências primeiro (cache)
COPY package.json package-lock.json ./
# garante legacy-peer-deps dentro do build
COPY .npmrc ./.npmrc
# `npm ci` falha se o lock estiver fora de sync; para dev/rebuild local usamos install
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Código e build
COPY . .
RUN npm run build

FROM nginx:alpine

# SPA fallback (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80



