# Distrib
FROM openjdk:13-alpine

# Maintainer
LABEL maintainer="starshistrelok@gmail.com"

# Copy files
COPY martin-platform.jar /martin-platform.jar
COPY application.yml /application.yml

ENTRYPOINT ["java","-jar","/martin-platform.jar"]

EXPOSE 8080
