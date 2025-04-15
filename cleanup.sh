#!/bin/bash

# Ensure we're in the repository root
cd "$(git rev-parse --show-toplevel)"

# Create backup
git branch backup

# Create a new .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore"
  touch .gitignore
fi

# Ensure .next and node_modules are in .gitignore
if ! grep -q "^\.next/" .gitignore; then
  echo "/.next/" >> .gitignore
fi
if ! grep -q "^node_modules/" .gitignore; then
  echo "/node_modules/" >> .gitignore
fi

# Use git rm to remove the files from history
echo "Removing .next directory from git history..."
git rm -r --cached --ignore-unmatch .next/

echo "Removing node_modules directory from git history..."
git rm -r --cached --ignore-unmatch node_modules/

# Commit the changes
git commit -m "Remove large files and directories from git history"

# Clean up repository
echo "Cleaning up repository..."
git gc --aggressive --prune=now

echo "Done! Repository has been cleaned. Check the size with 'git count-objects -v'."
echo "You may now push with 'git push -f origin main'." 