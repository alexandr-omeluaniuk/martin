#!/bin/bash
sudo docker login
sudo docker image tag martin:1.2 alexandromeluaniuk/martin:1.2
sudo docker image push alexandromeluaniuk/martin:1.2
