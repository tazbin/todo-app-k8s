#!/bin/bash

set -e

echo "🔧 Creating ConfigMap..."
kubectl apply -f configmap.yaml

echo "🔐 Creating Secret..."
kubectl apply -f secret.yaml

echo "🐘 Deploying PostgreSQL..."
kubectl apply -f postgres.yaml
kubectl rollout status statefulset/postgres --timeout=60s

echo "📦 Deploying Redis..."
kubectl apply -f redis.yaml
kubectl rollout status deployment/redis --timeout=60s

echo "🚀 Deploying Backend API..."
kubectl apply -f backend-api.yaml
kubectl rollout status deployment/backend-api --timeout=60s

echo "🌐 Deploying Frontend App..."
kubectl apply -f frontend-app.yaml
kubectl rollout status deployment/frontend-app --timeout=60s

echo "✅ All components deployed successfully!"