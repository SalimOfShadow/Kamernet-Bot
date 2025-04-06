import { logMessage } from "./logMessage";

export async function retrievePassword(): Promise<string> {
  return new Promise<string>((resolve) => {
    const input = process.stdin;
    const output = process.stdout;

    const setRawMode = (input as any).setRawMode;

    if (setRawMode) setRawMode.call(input, true);

    output.write("Enter your password: ");

    let password = "";

    const onData = (char: Buffer) => {
      const charStr = char.toString();

      if (charStr === "\r" || charStr === "\n") {
        // Enter key pressed, finish input
        output.write("\n");
        cleanup();
        resolve(password);
      } else if (charStr === "\u0003") {
        // Ctrl+C pressed, exit gracefully
        cleanup();
        process.exit();
      } else if (charStr === "\b" || charStr === "\x7f") {
        // Backspace key pressed, remove last character from password
        if (password.length > 0) {
          password = password.slice(0, -1);
          output.write("\b \b"); // Move cursor back, overwrite with space, and move back again
        }
      } else {
        password += charStr;
        output.write("*");
      }
    };

    const cleanup = () => {
      if (setRawMode) setRawMode.call(input, false); // Restore terminal mode
      input.removeListener("data", onData);
    };

    input.on("data", onData);
  });
}

export async function askForPassword(): Promise<string> {
  const password: string = await retrievePassword();

  if (password.length >= 4) {
    return password;
  }

  logMessage(
    "A Kamernet password needs to be at least 8 characters long",
    "warning",
    "yellow"
  ); // Display the warning

  return askForPassword(); // Recursively call until valid password is provided
}
