#!/bin/bash
docker login
docker image prune --force
docker image tag martin:1.3 alexandromeluaniuk/martin:latest
docker image push alexandromeluaniuk/martin:latest
