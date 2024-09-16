document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('output');
    
    let input = ''; // Store user input
    let history = []; // Command history
    let historyIndex = -1; // Index for command history
    let cursorVisible = true; // Blink cursor state
    const commands = {
        help: "Available commands: help, whoami, ls, echo [message], clear",
        whoami: "You are a visitor of this website.",
        ls: "file1.txt\nfile2.txt\nfolder1/",
        echo: (message) => message,
        clear: () => {
            outputElement.textContent = "";
            return "";
        }
    };

    function handleCommand(commandInput) {
        const [command, ...args] = commandInput.split(' ');
        const response = commands[command]
            ? typeof commands[command] === 'function'
                ? commands[command](args.join(' '))
                : commands[command]
            : "Command not found. Type 'help' for a list of commands.";

        outputElement.textContent += `${response}\n`;
        outputElement.scrollTop = outputElement.scrollHeight; // Auto-scroll to bottom
    }

    function runCommand() {
        if (input) {
            outputElement.textContent += `\nshell@127.0.0.1:~$ ${input}\n`;
            handleCommand(input);
            history.push(input); // Save command to history
            historyIndex = history.length; // Reset history index
            input = ''; // Clear input buffer
        }
        outputElement.textContent += "shell@127.0.0.1:~$ ";
    }

    function updateDisplay() {
        const displayText = `shell@127.0.0.1:~$ ${input}${cursorVisible ? '<span class="cursor">_</span>' : ''}`;
        outputElement.innerHTML = outputElement.innerHTML.replace(/shell@127\.0\.0\.1:~\$.*$/, displayText);
        outputElement.scrollTop = outputElement.scrollHeight; // Auto-scroll to bottom
    }

    // Blink cursor
    setInterval(() => {
        cursorVisible = !cursorVisible;
        updateDisplay();
    }, 500);

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'Enter') {
            event.preventDefault();
            runCommand();
        } else if (key === 'Backspace') {
            input = input.slice(0, -1);
            updateDisplay();
        } else if (key.length === 1) { // Regular character keys
            input += key;
            updateDisplay();
        } else if (key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input = history[historyIndex];
                updateDisplay();
            }
        } else if (key === 'ArrowDown') {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input = history[historyIndex];
            } else {
                input = '';
                historyIndex = history.length;
            }
            updateDisplay();
        } else if (key === 'Tab') {
            event.preventDefault();
            const possibleCommands = Object.keys(commands).filter(cmd => cmd.startsWith(input));
            if (possibleCommands.length === 1) {
                input = possibleCommands[0];
                updateDisplay();
            }
        }
    });

    outputElement.textContent = "shell@127.0.0.1:~$ ";
});
