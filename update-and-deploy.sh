#!/bin/bash
# Update and Deploy Script for PAL-of-the-Bayou Website

# Change to the project directory (if not already there)
cd "$(dirname "$0")"

echo "Checking git status..."
git status

echo "Staging all changes..."
git add .

echo "Enter a commit message:"
read commit_msg

git commit -m "$commit_msg"

echo "Pushing to GitHub..."
git push origin main

echo "Done! Check Netlify for the new deploy." 