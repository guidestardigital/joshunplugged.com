FROM strapi/base

RUN npm i -g strapi

WORKDIR $DIRPATH/$DIRNAME

COPY backend .
COPY .env.prod .env

RUN rm yarn.lock
RUN yarn

RUN chmod +x /wait-for-it.sh

EXPOSE 1337

ENV NODE_ENV production
ENTRYPOINT [ "sh", "-c", "./wait-for-it.sh -t 30 blog_postgres:5432 -- yarn start:docker:prod" ]