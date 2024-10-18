# PoseControlledDinoGame

This project allows you to control the classic Dino game using real-time body movement detection through your webcam. By leveraging PoseNet for pose estimation, you can jump and crouch in the game without using a keyboard, just by moving your body.

## Features

- **Jump and Crouch with Body Movements**: Use your body to play the game. No need to touch the keyboard!
- **Pose Detection via PoseNet**: Your movements are tracked using PoseNet to detect jumps and crouches.
- **Webcam-based Interaction**: The game uses your webcam to capture movements.
- **Real-time Feedback**: Instant feedback on your movements, making the game interactive and fun.

## Getting Started

### Prerequisites

To run this project, you'll need:

- A webcam
- A modern browser that supports JavaScript and HTML5
- Node.js and npm (if running locally)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/PoseControlledDinoGame.git
    cd PoseControlledDinoGame
    ```

2. Install the dependencies (if any):

    ```bash
    npm install
    ```

3. Start the project:

    If you're running this in a local environment, you can simply open the `index.html` file in your browser or use a local server.

4. Grant permission for webcam access when prompted by your browser.

### Usage

1. Open the game in your browser. You should see a video feed from your webcam and the Dino game on the screen.
2. Stand in front of the webcam and perform the following actions:
    - **Jump**: Stand and then quickly raise your body up to simulate a jump.
    - **Crouch**: Bend down to simulate crouching.

### Customization

You can tweak the game’s settings by modifying the `Runner.config` section in the code to change the game's speed, gravity, obstacle frequency, and more.

### Known Issues

Lag in Movement Detection: In some cases, movement detection may have a slight delay. Adjusting the sensitivity in thresholdJump and thresholdCrouch can help improve responsiveness.

### Contributing

If you want to contribute to the project, feel free to fork the repository, make your changes, and submit a pull request.

### License

This project is licensed under the MIT License.



