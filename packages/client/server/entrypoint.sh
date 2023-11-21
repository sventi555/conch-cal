#!/usr/bin/env bash

# Construct an up to date environment.js file
# Note: Vite will only include variables that are prefixed with VITE_ in the built application.
# Please add any updates to `.env.example`, `src/config.ts`, and here.
echo "window.ENV = {
  \"hosts\": {
    \"api\": \"$VITE_API_HOST\",
  },
  \"firebase\": {
    \"apiKey\": \"$VITE_FIREBASE_API_KEY\",
    \"projectId\": \"$VITE_FIREBASE_PROJECT_ID\",
    \"appId\": \"$VITE_FIREBASE_APP_ID\",
  },
};" > /usr/share/nginx/html/environment.js;

# Add environment script tag to index.html
awk '/<head>/{print;print "    <script type=\"text/javascript\" src=\"/environment.js\"></script>";next}1' /usr/share/nginx/html/index.html > /usr/share/nginx/html/temp.txt && mv /usr/share/nginx/html/temp.txt /usr/share/nginx/html/index.html

# Create the nginx conf file with the specified port number
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Transfer control to nginx to begin serving files
nginx -g "daemon off;"
