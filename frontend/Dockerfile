FROM node:16-alpine

WORKDIR /usr/app

COPY . .

# Using this instead of npm i for install exact version of dependencies in package-lock.json
RUN npm ci 

RUN npm run build

CMD ["npm", "start"]