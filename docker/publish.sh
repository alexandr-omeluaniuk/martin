#!/bin/bash
sudo docker login
sudo docker image prune --force
sudo docker image tag martin:1.3 alexandromeluaniuk/martin:latest
sudo docker image push alexandromeluaniuk/martin:latest
