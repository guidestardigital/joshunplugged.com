FROM node:12

# Create app directory
WORKDIR /app
ADD frontend /app/
COPY .env.prod /app/.env

RUN npm ci
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

# start command
ENTRYPOINT [ "sh", "-c", "yarn start" ]