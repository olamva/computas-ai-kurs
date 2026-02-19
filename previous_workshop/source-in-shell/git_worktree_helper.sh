#!/usr/bin/env bash
# Git Worktree Helper
# Source this file in your .bashrc or .zshrc to use the worktree functions
# Usage: source git-worktree-helper.sh

# Create a new worktree based on the current branch with a postfix
# Usage: worktree-create <postfix>
worktree-create() {
    local postfix="$1"

    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "Error: Not in a git repository"
        return 1
    fi

    # Check if postfix is provided
    if [ -z "$postfix" ]; then
        echo "Usage: worktree-create <postfix>"
        echo "Example: worktree-create feature-new"
        return 1
    fi

    # Get the current branch name
    local current_branch
    current_branch=$(git branch --show-current)

    if [ -z "$current_branch" ]; then
        echo "Error: Could not determine current branch (you might be in detached HEAD state)"
        return 1
    fi

    # Create the new branch name
    local new_branch="${current_branch}-${postfix}"

    # Get the repository root directory
    local repo_root
    repo_root=$(git rev-parse --show-toplevel)

    # Get the parent directory of the repository
    local parent_dir
    parent_dir=$(dirname "$repo_root")

    # Get the repository name
    local repo_name
    repo_name=$(basename "$repo_root")

    # Create the new worktree directory path
    local worktree_path="${parent_dir}/${repo_name}-${postfix}"

    # Check if the worktree directory already exists
    if [ -d "$worktree_path" ]; then
        echo "Error: Directory already exists: $worktree_path"
        return 1
    fi

    # Check if the branch already exists
    if git show-ref --verify --quiet "refs/heads/$new_branch"; then
        echo "Branch '$new_branch' already exists. Creating worktree from existing branch..."
        git worktree add "$worktree_path" "$new_branch"
    else
        echo "Creating new branch '$new_branch' and worktree at: $worktree_path"
        git worktree add -b "$new_branch" "$worktree_path"
    fi

    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Worktree created successfully!"
        echo "  Branch: $new_branch"
        echo "  Path: $worktree_path"
        echo ""
        echo "To navigate to the new worktree:"
        echo "  cd \"$worktree_path\""
    else
        echo "Error: Failed to create worktree"
        return 1
    fi
}

# List all worktrees
# Usage: worktree-list
worktree-list() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "Error: Not in a git repository"
        return 1
    fi

    echo "Git worktrees:"
    git worktree list
}

# Remove a worktree
# Usage: worktree-remove <path>
worktree-remove() {
    local worktree_path="$1"

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "Error: Not in a git repository"
        return 1
    fi

    if [ -z "$worktree_path" ]; then
        echo "Usage: worktree-remove <path>"
        echo ""
        echo "Available worktrees:"
        git worktree list
        return 1
    fi

    git worktree remove "$worktree_path"

    if [ $? -eq 0 ]; then
        echo "✓ Worktree removed: $worktree_path"
    else
        echo "Error: Failed to remove worktree"
        return 1
    fi
}

# echo "Git Worktree Helper loaded!"
# echo "Available commands:"
# echo "  worktree-create <postfix>  - Create a new worktree with postfix"
# echo "  worktree-list             - List all worktrees"
# echo "  worktree-remove <path>    - Remove a worktree"
