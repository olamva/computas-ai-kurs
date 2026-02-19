agent-init-md() {
    local CONFIG_DIR="$HOME/.config/coding-with-ai-workshop/default-project-config"

    # Choose target filename
    echo "Select target file:"
    echo "1) CLAUDE.md"
    echo "2) AGENTS.md"
    printf "Choice [1-2]: "
    read choice

    local TARGET
    case $choice in
        1) TARGET="CLAUDE.md" ;;
        2) TARGET="AGENTS.md" ;;
        *) echo "Invalid choice"; return 1 ;;
    esac

    # Get all available templates
    local files=()
    while IFS= read -r line; do
        files+=("$line")
    done < <(ls "$CONFIG_DIR"/*.md 2>/dev/null | sort)

    if [ ${#files[@]} -eq 0 ]; then
        echo "No templates found"
        return 1
    fi

    # Show options
    printf "\nSelect template:\n"
    local i=1
    for file in "${files[@]}"; do
        local name=$(basename "$file" .md)
        echo "$i) $name"
        i=$((i+1))
    done

    # Get selection
    printf "Choice [1-${#files[@]}]: "
    read sel

    if [ "$sel" -lt 1 ] || [ "$sel" -gt ${#files[@]} ]; then
        echo "Invalid choice"
        return 1
    fi

    # Copy file
    cp "${files[$((sel-1))]}" "./${TARGET}"
    echo "Created ./${TARGET}"
}
