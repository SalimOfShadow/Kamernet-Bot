# Kamernet-Bot

**Kamernet-Bot** is a bot designed to automatically reply to listings on the platform Kamernet. By using custom parameters, the bot processes new rental listings and responds automatically if all criteria are met.

## Features

- Automatically checks for the desired listings (Room, Apartment,Studio etc..).
- Responds to listings that match given criteria (e.g., price range, location, room type).
- Customizable parameters for filtering and replying to listings.
- Configurable timing interval for checking listings and sending responses.
- Logs interactions for tracking purposes.
- Using a [patched version](https://github.com/rebrowser/rebrowser-patches) of Puppeteer, it now passes all the tests on [Bot Detector](https://bot-detector.rebrowser.net/) and [Browser Scan](https://www.browserscan.net/bot-detection) ensuring it behaves as much as possible like a human and avoids detection...(**FOR NOW**)!
  Results may change at any time.
- Comes with a Dockerfile to build and run the bot on an separated environment like a VPS.

## Requirements

Before using **Kamernet-Bot**, ensure you have the following software installed:

- **Node.js** (version 16 or higher)
- **npm** (Node package manager)

## Installation

1.  Clone the repository:

    ```
    git clone https://github.com/SalimOfShadow/Kamernet-Bot.git
    ```

    ### Or download the **zip** file.

2.  Navigate to the project folder:

    ```
    cd Kamernet-Bot
    ```

3.  Install dependencies:

    ```
    npm install
    ```

4.  (Optional) To run with Docker, follow the Docker setup instructions below.

## Configuration

The bot can be configured by modifying the .env file.
Create a .env file to store your environment variables, and open it with your favourite text editor program (Notepad will do just fine!).
Insert your parameters on all the fields,you can use the provided .env.example file as a template.

### Example .env file parameters:

    KAMERNET_EMAIL=your_email                                           # Your Kamernet username
    LOCATION="Amsterdam"                                                # The desired location for the room (e.g., city or neighborhood)
    LISTING_TYPE="room,apartment,studio,anti-squat,student-housing"     # The type of listings you are searching for
    MAX_PRICE="1000"                                                    # Maximum price you're willing to pay for rent
    MIN_SIZE=2                                                          # Minimum surface area in square meters
    RADIUS=1                                                            # Maximum radius in km from your selected location
    CUSTOM_REPLY_ROOM="Example Reply"                                   # Custom message for a single room ad
    CUSTOM_REPLY_APARTMENT="Example Reply"                              # Custom message for a whole apartment ad
    INTERVAL=15                                                         # Interval (in minutes) for checking new listings
    FILTERED_WORDS="Dutch Only"                                         # Blacklist for words found in the descriptions

### Timings

The bot will check the Kamernet website for new listings every 15 minutes by default,but this is purely arbitrary.If you wish so,you can modify the interval by adjusting the paramater inside the .env file.

## Usage

1. Start the bot by running the following command:

   ```
   npm start
   ```

2. The bot will begin checking new listings on Kamernet.net and automatically reply to any that match the criteria defined in your .env file.

3. The bot will output logs to the terminal. It will also create a file named **logs.txt** with informations about replies sent, successful interactions, or errors encountered.

## Docker Setup (Optional)

To run **Kamernet-Bot** using Docker:

1. Build the Docker image:

   ```
   docker build -t Kamernet-Bot .
   ```

2. Run the Docker container:

   ```
   docker run -d --env-file .env Kamernet-Bot
   ```

This will run **Kamernet-Bot** inside a Docker container, using the environment variables from your .env file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this repository, submit issues, and create pull requests. Contributions are welcome!
