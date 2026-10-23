FROM node:23-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# npm, npx, corepack and yarn are only needed to install; the runtime is plain node.
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx \
           /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*
COPY --chown=node:node . .
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]
