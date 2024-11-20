import * as fs from 'fs';
import * as path from 'path';

// TODO - ERASE THE CONTENT WHEN LAUNCHING THE PROGRAM THE FIRST TIME AND LOG COLORED MESSAGE TO THE CONSOLE

export async function logMessage(message: string, severity?: string) {
  const logFilePath = path.join(__dirname, '../../log.txt');

  // Generate a formatted timestamp: [mm/dd/yy hh:mm:ss]
  const now = new Date();
  const timeStamp = `[${String(now.getMonth() + 1).padStart(2, '0')}/${String(
    now.getDate()
  ).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)} ${String(
    now.getHours()
  ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
    now.getSeconds()
  ).padStart(2, '0')}]`;

  // Append the message to the log file
  fs.appendFile(logFilePath, `${timeStamp} : ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } else {
      console.log('Log message written successfully');
    }
  });
}
