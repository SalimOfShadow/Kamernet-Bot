# kamer-bot

**kamer-bot** is a bot designed to automatically reply to room rental insertions on Kamernet.net. By using predefined parameters, the bot processes new rental listings and sends automatic responses based on user preferences.

## Features

- Automatically checks for new room rental listings on Kamernet.net.
- Responds to listings that match given criteria (e.g., price range, location, room type).
- Customizable parameters for filtering and replying to listings.
- Configurable timing for checking listings and sending responses.
- Logs interactions for tracking purposes.

## Requirements

Before using **kamer-bot**, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (Node package manager)
- **Puppeteer** (for browser automation)
- **dotenv** (for environment variable management)

## Installation

1. Clone the repository:

   \`\`\`bash
   git clone https://github.com/yourusername/kamer-bot.git
   \`\`\`

2. Navigate to the project folder:

   \`\`\`bash
   cd kamer-bot
   \`\`\`

3. Install dependencies:

   \`\`\`bash
   npm install
   \`\`\`

4. Create a \`.env\` file to store your environment variables, and set them accordingly. You can use the provided \`.env.example\` file as a template.

   Example \`.env\` file:

   \`\`\`plaintext
   KAMERNET_USERNAME=your_username
   KAMERNET_PASSWORD=your_password
   BOT_PARAMETERS='{"max_price": 1000, "min_rooms": 2, "location": "Amsterdam"}'
   \`\`\`

## Configuration

The bot can be configured by modifying the parameters in the \`.env\` file or by adjusting the script directly.

### Customizing Parameters

- **max_price**: Maximum price you're willing to pay for rent (in currency of choice).
- **min_rooms**: Minimum number of rooms you're looking for in the listing.
- **location**: The desired location for the room (e.g., city or neighborhood).

### Example Parameters

\`\`\`json
{
"max_price": 600,
"min_rooms": 2,
"location": "Amsterdam"
}
\`\`\`

### Timings

The bot will check Kamernet.net for new listings every 15 minutes by default. You can modify the interval by adjusting the code or using a cron job to automate the process.

## Usage

1. Start the bot by running the following command:

   \`\`\`bash
   npm start
   \`\`\`

2. The bot will begin checking new listings on Kamernet.net and automatically reply to any that match the criteria defined in your \`.env\` file.

3. The bot logs interactions and responses. Check the logs for information about replies sent, successful interactions, or errors encountered.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this repository, submit issues, and create pull requests. Contributions are welcome!
