#!/bin/bash

KEY_PATH=/Users/tazbinur/learning/devOps/aws-key/tazbinur-server-keypair.pem
LOCAL_DIR=/Users/tazbinur/learning/devOps/k8s/todo-app/k8s
EC2_USER=ec2-user
EC2_IP=52.90.120.111
REMOTE_DIR=/home/ec2-user/k8s

# === Copy Folder ===
echo "Copying $LOCAL_DIR to $EC2_USER@$EC2_IP:$REMOTE_DIR ..."
scp -i "$KEY_PATH" -r "$LOCAL_DIR" "$EC2_USER@$EC2_IP:$REMOTE_DIR"

# === Status ===
if [ $? -eq 0 ]; then
  echo "✅ Folder copied successfully!"
else
  echo "❌ Failed to copy folder."
fi
