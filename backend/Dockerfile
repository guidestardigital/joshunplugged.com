FROM strapi/base

WORKDIR $DIRPATH/$DIRNAME

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN chmod +x /wait-for-it.sh

EXPOSE 1337

ARG POSTGRES_HOST=undefined
ENV POSTGRES_HOST=$POSTGRES_HOST
ARG POSTGRES_PORT=undefined
ENV POSTGRES_PORT=$POSTGRES_PORT
ARG POSTGRES_USER=undefined
ENV POSTGRES_USER=$POSTGRES_USER
ARG POSTGRES_DB=undefined
ENV POSTGRES_DB=$POSTGRES_DB

ENV NODE_ENV production

RUN yarn build

ENTRYPOINT [ "sh", "-c", "./wait-for-it.sh -t 30 $POSTGRES_HOST:$POSTGRES_PORT -- yarn start:docker:prod" ]