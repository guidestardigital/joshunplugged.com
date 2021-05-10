FROM endeveit/docker-jq AS deps

# https://stackoverflow.com/a/58487433
# To prevent cache invalidation from changes in fields other than dependencies

COPY package.json /tmp

RUN jq '{ scripts, dependencies, devDependencies }' < /tmp/package.json > /tmp/deps.json

FROM node:10

WORKDIR /app

COPY --from=deps /tmp/deps.json /app/package.json
COPY package-lock.json /app/

RUN npm ci

ADD . /app/
COPY --from=deps /tmp/deps.json /app/package.json

ARG API_DOMAIN=API_DOMAIN_NOT_SET
ENV API_DOMAIN=$API_DOMAIN
ARG NODE_ENV=NODE_ENV_NOT_SET
ENV NODE_ENV=$NODE_ENV
ARG BUILD_VERSION=BUILD_VERSION_ENV_NOT_SET
ENV BUILD_VERSION=$BUILD_VERSION

RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

ENTRYPOINT [ "sh", "-c", "npm run start" ]