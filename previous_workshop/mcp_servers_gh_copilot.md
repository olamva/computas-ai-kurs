

first you need to make sure code is on the path

In VS Code:

Open Command Palette

Run: “Shell Command: Install 'code' command in PATH”

Restart your terminal

```
which code
code --version
```

example install command:

```
code --add-mcp '{"name":"io.github.ChromeDevTools/chrome-devtools-mcp","command":"npx","args":["-y","chrome-devtools-mcp"],"env":{}}'
```

