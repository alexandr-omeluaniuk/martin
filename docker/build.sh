#!/bin/bash
echo "Start build..."
sudo mkdir -p -m 777 /var/martin/logs
sudo mkdir -p -m 777 /var/martin/config
cp config/application.yml /var/martin/config/application.yml
cp ../martin-application/target/martin-platform.jar .
echo "JAR copied"
sudo docker image build --no-cache -t martin:1.3 .
echo "Done..."
