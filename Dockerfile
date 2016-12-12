FROM node:latest

COPY dist dist

CMD node dist/server.js