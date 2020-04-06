#!/bin/bash
echo "Start build..."
#sudo mkdir -p -m 777 /var/martin/logs
#sudo mkdir -p -m 777 /var/martin/config
echo "Run React build..."
cd ../martin-application/src/main/resources/static/crm
npm run build
echo "Run Maven build..."
cd ../../../../../../
export JAVA_HOME="/usr/lib/jvm/jdk-13"
mvn clean install -P production-profile
cd docker
#cp config/application.yml /var/martin/config/application.yml
cp ../martin-application/target/martin-platform.jar .
echo "JAR copied"
docker image build --no-cache -t martin:1.3 .
echo "Done..."
