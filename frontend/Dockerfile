FROM node:12

# Create app directory
WORKDIR /app
ADD . /app/

RUN rm yarn.lock
RUN yarn

ARG BLOG_API_DOMAIN=https://api.myblogdomain.com
ENV BLOG_API_DOMAIN=$BLOG_API_DOMAIN

ARG BLOG_API_BASE=https://api.myblogdomain.com
ENV BLOG_API_BASE=$BLOG_API_BASE

RUN STRAPI_BASE_URL=https://api.joshunplugged.com yarn build

ENV HOST 0.0.0.0
EXPOSE 3000

# start command
ENTRYPOINT [ "sh", "-c", "yarn start" ]