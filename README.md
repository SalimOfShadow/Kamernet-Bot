# Kamer-bot

**kamer-bot** is a bot designed to automatically reply to room rental insertions on Kamernet.net. By using predefined parameters, the bot processes new rental listings and responds automatically if the criteria are met.

## Features

- Automatically checks for new room rental listings on Kamernet.net.
- Responds to listings that match given criteria (e.g., price range, location, room type).
- Customizable parameters for filtering and replying to listings.
- Configurable timing for checking listings and sending responses.
- Logs interactions for tracking purposes.
- Passes tests on [Bot Detector](https://bot-detector.rebrowser.net/) and [Broswer Scan](https://www.browserscan.net/bot-detection) ensuring it behaves like a human and avoids detection,though results may change at any time.
- Can be run in Docker for easy deployment.

## Requirements

Before using **kamer-bot**, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (Node package manager)
- **Puppeteer** (for browser automation)
- **dotenv** (for environment variable management)

## Installation

1.  Clone the repository:

    ```
    git clone https://github.com/yourusername/kamer-bot.git
    ```

2.  Navigate to the project folder:

    ```
    cd kamer-bot
    ```

3.  Install dependencies:

    ```
    npm install
    ```

4.  (Optional) To run with Docker, follow the Docker setup instructions below.

## Configuration

The bot can be configured by modifying the parameters in the .env file or by adjusting the script directly.
Create a .env file to store your environment variables, and set them accordingly. You can use the provided .env.example file as a template.

### Example .env file parameters:

    KAMERNET_USERNAME=your_username             # Your Kamernet username
    KAMERNET_PASSWORD=your_password             # Your Kamernet password
    MAX_PRICE="1000"                            # Maximum price you're willing to pay for rent (in currency of choice)
    MIN_AREA="2"                                # Minimum surface area in square meters
    LOCATION="Amsterdam"                        # The desired location for the room (e.g., city or neighborhood)
    CUSTOM_REPLY_ROOM="Example Reply"           # Custom message for a single room ad
    CUSTOM_REPLY_APARTMENT="Example Reply"      # Custom message for a whole apartment ad
    INTERVAL=15                                 # Interval (in minutes) for checking new listings

### Timings

The bot will check Kamernet.net for new listings every 15 minutes by default. You can modify the interval by adjusting the parameters.

## Usage

1. Start the bot by running the following command:

   ```
   npm start
   ```

2. The bot will begin checking new listings on Kamernet.net and automatically reply to any that match the criteria defined in your .env file.

3. The bot logs interactions and responses. Check the logs for information about replies sent, successful interactions, or errors encountered.

## Docker Setup (Optional)

To run **kamer-bot** in Docker:

1. Build the Docker image:

   ```
   docker build -t kamer-bot .
   ```

2. Run the Docker container:

   ```
   docker run -d --env-file .env kamer-bot
   ```

This will run **kamer-bot** inside a Docker container, using the environment variables from your .env file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this repository, submit issues, and create pull requests. Contributions are welcome!
