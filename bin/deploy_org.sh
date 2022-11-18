#!/bin/bash

cd /opt/canonizer_3_web/

echo "Pull from github"
sudo git pull origin development

if (( $? )); then
  echo "Failure" >&2
  exit 1
else
  echo "Pull from github completed"
fi


sudo yarn install

echo "Start building the application"

sudo yarn build

if (( $? )); then
  echo "Failed to build the application" >&2
  exit 1
else
  echo "Application build completed"
fi

echo "Restarting the application"
pm2 restart canonizer3-web

echo "Application deployment completed"
