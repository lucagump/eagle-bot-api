FROM node:12
# FROM node:8.16.2-alpine


ENV KEY=key
ENV SECRET=secret

ADD . /

RUN npm install

EXPOSE 80

CMD ["nodemon", "-r", "dotenv/config", "server.js", "dotenv_config_path=./"]
# CMD ["node", "/src/index.js"]



