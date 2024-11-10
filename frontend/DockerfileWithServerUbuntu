FROM ubuntu:latest
LABEL "author"="binh"
LABEL "project"="frontend-nextjs"
RUN apt update && apt install git -y
RUN apt install apache2 -y
RUN apt-get update -yq && apt-get upgrade -yq && apt-get install -yq curl git nano
# Install nodejs, npm in ubuntu
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
EXPOSE 81
WORKDIR /var/www/html
VOLUME /var/log/apache2
COPY . .

RUN npm install
RUN npm run build

# Copy the start script
COPY start.sh /start.sh

# Make the start script executable
RUN chmod +x /start.sh

# Use the start script as the entry point
CMD ["/start.sh"]