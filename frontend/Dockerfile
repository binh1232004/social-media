FROM node:20.12.0

WORKDIR /usr/app


# In github action, if copy . . it will copy entire repo no matter how Dockerfile is placed
COPY frontend/ .

# Debug
RUN pwd
RUN ls
# Using this instead of npm i for install exact version of dependencies in package-lock.json
RUN npm ci 

RUN npm run build

CMD ["npm", "start"]