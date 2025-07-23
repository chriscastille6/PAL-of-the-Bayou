#!/bin/bash

# Dr. Christopher M. Castille Website Deployment Script
# This script builds and deploys the website

echo "🚀 Starting deployment process..."

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo is not installed. Please install Hugo first."
    exit 1
fi

# Check Hugo version
HUGO_VERSION=$(hugo version | grep -o 'v[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1)
echo "📦 Using Hugo version: $HUGO_VERSION"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf public/

# Get Hugo modules
echo "📥 Getting Hugo modules..."
hugo mod get

# Build the site
echo "🔨 Building site..."
hugo --minify

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📊 Build statistics:"
    echo "   - Pages: $(find public -name "*.html" | wc -l | tr -d ' ')"
    echo "   - Total files: $(find public -type f | wc -l | tr -d ' ')"
    echo "   - Build directory: $(du -sh public | cut -f1)"
    
    # If git is available, commit changes
    if command -v git &> /dev/null; then
        echo "📝 Committing changes to git..."
        git add .
        git commit -m "Update website - $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        echo "✅ Changes pushed to repository"
    fi
    
    echo "🎉 Deployment complete!"
    echo "🌐 Your site is ready for deployment to Netlify/GitHub Pages"
else
    echo "❌ Build failed!"
    exit 1
fi 