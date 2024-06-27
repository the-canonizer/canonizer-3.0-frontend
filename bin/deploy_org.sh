#!/bin/bash

SCRIPT="deploy_org.sh"

NUM_PROC=`ps -ef | grep 'deploy_org.sh' | grep -v vi |  wc -l`
echo "Number of process are $NUM_PROC"
echo `ps -ef | grep 'deploy_org.sh' | grep -v vi`

# Check if another instance is running
if  [  "$NUM_PROC" -gt "4"  ]; then
    echo "Another instance of the deployment is running."
    echo "Exiting the script"
    exit
fi

# Check Backend deployment
cd /var/www/html/canonizer_3_api/

echo "Pull from github for backend apis"
sudo git pull origin development --no-edit > /tmp/be_deploy.txt

# Check if there is anything to update in repository
 if grep 'Already up to date.' /tmp/be_deploy.txt | wc -l; then
     echo "Nothing to update."
 else
     sudo php artisan migrate
 fi

cd /opt/canonizer_3_web/

echo "Pull from github"
sudo git pull origin development --no-edit > /tmp/fe_deploy.txt

# Check if there is anything to update in repository
if grep 'Already up to date.' /tmp/fe_deploy.txt | wc -l; then
    echo "Nothing to update."
    exit
fi

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
