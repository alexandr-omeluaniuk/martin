#!/bin/bash
echo "Start build..."
cp ../martin-application/target/martin-platform.jar .
echo "JAR copied"
sudo docker image build --no-cache -t martin:1.2 .
echo "Done..."
