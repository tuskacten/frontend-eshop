FROM node:16-alpine
ENV NODE_ENV="production"
ENV PORT=8079
EXPOSE 8079
RUN addgroup mygroup && adduser -D -G mygroup myuser && mkdir -p /usr/src/app && chown -R myuser /usr/src/app

# Prepare app directory
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN chown myuser /usr/src/app/yarn.lock

USER myuser
RUN npm install --production --no-package-lock

COPY . /usr/src/app

# Start the app
CMD ["node", "server.js"]
