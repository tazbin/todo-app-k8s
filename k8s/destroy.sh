#!/bin/bash

set -e

echo "🗑️ Deleting Frontend..."
kubectl delete -f frontend-app.yaml || true

echo "🗑️ Deleting Backend..."
kubectl delete -f backend-api.yaml || true

echo "🗑️ Deleting Redis..."
kubectl delete -f redis.yaml || true

echo "🗑️ Deleting PostgreSQL..."
kubectl delete -f postgres.yaml || true

echo "🗑️ Deleting Secret..."
kubectl delete -f secret.yaml || true

echo "🗑️ Deleting ConfigMap..."
kubectl delete -f configmap.yaml || true

echo "✅ All components deleted successfully!"
