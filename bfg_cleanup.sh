#!/bin/bash

# Ensure we're in the repository root
cd "$(git rev-parse --show-toplevel)"

# Create a backup branch
git branch backup-before-bfg

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Download BFG Jar file
echo "Downloading BFG Repo-Cleaner..."
curl -L -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Go back to the repository
cd "$(git rev-parse --show-toplevel)"

# Make sure .next and node_modules are in .gitignore
if ! grep -q "^\.next/" .gitignore; then
  echo "/.next/" >> .gitignore
fi
if ! grep -q "^node_modules/" .gitignore; then
  echo "/node_modules/" >> .gitignore
fi
git add .gitignore
git commit -m "Update .gitignore before BFG cleanup" || echo "No changes to commit"

# Create a mirror clone of the repository
cd ..
git clone --mirror ChileDAO ChileDAO.git
cd ChileDAO.git

# Run BFG to remove directories
echo "Running BFG to remove large directories..."
java -jar $TEMP_DIR/bfg.jar --delete-folders node_modules --delete-folders .next --strip-blobs-bigger-than 1M .

# Clean up repository
echo "Cleaning up repository..."
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Go back to the original repository
cd ../ChileDAO

# Update the repository with the cleaned history
echo "Updating original repository..."
git remote add origin-clean ../ChileDAO.git
git fetch origin-clean
git reset --hard origin-clean/main

# Clean up
rm -rf ../ChileDAO.git
rm -rf $TEMP_DIR

echo "Done! Repository has been cleaned."
echo "Check the size with: git count-objects -v"
echo "You may now push with: git push -f origin main" 