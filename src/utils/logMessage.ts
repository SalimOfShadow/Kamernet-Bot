import * as fs from "fs";
import * as path from "path";

// TODO - ERASE THE CONTENT WHEN LAUNCHING THE PROGRAM THE FIRST TIME AND LOG COLORED MESSAGE TO THE CONSOLE

export function logMessage(message: string, color?: string) {
  const logFilePath: string = path.join(__dirname, "../../log.txt");

  switch (color) {
    case "black":
      console.log(`\x1b[30m${message}\x1b[0m`);
      break;
    case "red":
      console.log(`\x1b[31m${message}\x1b[0m`);
      break;
    case "green":
      console.log(`\x1b[32m${message}\x1b[0m`);
      break;
    case "yellow":
      console.log(`\x1b[33m${message}\x1b[0m`);
      break;
    case "blue":
      console.log(`\x1b[34m${message}\x1b[0m`);
      break;
    case "magenta":
      console.log(`\x1b[35m${message}\x1b[0m`);
      break;
    case "cyan":
      console.log(`\x1b[36m${message}\x1b[0m`);
      break;
    case "white":
      console.log(`\x1b[37m${message}\x1b[0m`);
      break;
    default:
      console.log(message);
  }

  // Generate a formatted timestamp: [mm/dd/yy hh:mm:ss]
  const now = new Date();
  const timeStamp = `[${String(now.getMonth() + 1).padStart(2, "0")}/${String(
    now.getDate()
  ).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}]`;

  // Append the message to the log file
  fs.appendFile(logFilePath, `${timeStamp} : ${message}\n`, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

export function clearLogs() {
  const logFilePath: string = path.join(__dirname, "../../log.txt");
  fs.rm(logFilePath, () => {});
}
