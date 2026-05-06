FROM library/node:22.16.0-alpine
RUN apk update && apk upgrade && apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install --production && npm cache clean --force
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:80/ || exit 1
CMD npm run translate; npm start
