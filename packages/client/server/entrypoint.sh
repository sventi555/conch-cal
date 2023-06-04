#!/usr/bin/env bash

# Construct an up to date environment.js file
echo "window.ENV = {
  \"apiHost\": \"$VITE_API_HOST\",
};" > /usr/share/nginx/html/environment.js;

envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Transfer control to nginx to begin serving files
nginx -g "daemon off;"
