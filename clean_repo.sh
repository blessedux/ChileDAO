#!/bin/bash

# Create a temporary directory for our new repo
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Copy all files except .git, node_modules, .next
echo "Copying files to new repository..."
rsync -av --progress . $TEMP_DIR --exclude .git --exclude node_modules --exclude .next

# Initialize a new git repository in the temporary directory
cd $TEMP_DIR
echo "Initializing new git repository..."
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files and commit
echo "Adding files to new repository..."
git add .
git commit -m "Initial commit with clean history"

# Add the original remote
echo "Adding remote repository..."
git remote add origin https://github.com/blessedux/ChileDAO.git

# Try to push
echo "Attempting to push to remote repository..."
echo "You may need to enter your GitHub credentials."

# Display instructions for the final push
echo ""
echo "===== NEXT STEPS ====="
echo "To complete the process, please run these commands in the temporary directory:"
echo "cd $TEMP_DIR"
echo "git push -f origin main"
echo ""
echo "After successful push, you can clone the repository fresh with:"
echo "cd .."
echo "rm -rf ChileDAO"
echo "git clone https://github.com/blessedux/ChileDAO.git"
echo "=====================" 