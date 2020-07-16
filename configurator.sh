#!/bin/bash
wget -q https://raw.githubusercontent.com/kokkekpek/configurator/v1.1.0/lib/index.js index.js | docker run -t --rm --name script -v "$PWD":/usr/src/app -w /usr/src/app node:14.5-alpine node . && rm index.js