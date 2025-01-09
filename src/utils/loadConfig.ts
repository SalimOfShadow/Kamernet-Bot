import { Settings } from '../bot';
import * as fs from 'fs';
import * as YAML from 'yaml';

export interface ConfigJSON {
  KAMERNET_EMAIL: string;
  LOCATION: string[];
  LISTING_TYPE: string[];
  MAX_PRICE: number;
  MIN_SIZE: number;
  RADIUS: number;
  INTERVAL: number;
  CUSTOM_REPLY: {
    ROOM: string;
    APARTMENT: string;
  };
  FILTERED_WORDS: string[];
}

// Load configuration file and convert keys to camelCase
export function loadConfigFile(filePath: string): ConfigJSON {
  try {
    const rawConfig = fs.readFileSync(filePath, 'utf-8');
    const config = YAML.parse(rawConfig);
    console.log(config);
    return config;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to load configuration file: ${filePath}`);
      console.error(error.message);
    }
    process.exit(1); // Exit the application if configuration loading fails
  }
}
