FROM node:latest

WORKDIR /usr/app


COPY . .

# Using this instead of npm i for install exact version of dependencies in package-lock.json
RUN pwd
RUN ls
RUN npm ci 

RUN npm run build

CMD ["npm", "start"]