# PartnerMe - V2 (tm)

## Description

<b>TankGo!</b> is a multiplayer game where two players battle it out in an all-out tank shootout. It is a 2D top-down competitive game that is easy to learn, fun to play,  and suitable for players over 10 years old. Featuring an android app controller compatible on any android device, it will be the platform users can control the movement and fire of their tank, show information such as current power ups or win rate history, and connect to either online multiplayer, local bluetooth multiplayer, or single player game. The DE1-SoC will be the game console, with a graphics accelerator, game engine with game AI, and hub for connection via Bluetooth. A multi-functional server records scores in a database and provides online play capabilities by communicating with multiple DE1s and android devices through the internet.
 
TankGo! Gameplay: Two tanks on either side of the screen battle it out by firing bullets across the screen, collecting power-ups (faster bullets, faster tank, more health) to increase their odds to overcome their opponent. First to destroy the enemy tank is crowned a victory!
 
HOW: The DE1 will serve as a game console, connected to two Android phones through the cloud server as game controllers, or to a single bluetooth device for local two-player. The game can also be played in 1-player mode against a computer controlled AI. Using messages from the Android devices, like signals for going up or down and shooting, the DE1 will draw the updated positions of tanks using the accelerated VGA core. Additionally, the DE1 can also be connected to a game server via internet connection, and an online version can be played between two DE1s, and the game state/controls will be controlled by the cloud game server. Information about the game and users will be saved on the cloud once a game winning condition has been met.


## Backend - Express/NodeJs

### Testing

-   install latest version of Node
-   Download/pull source code
-   in folder cmd, do "npm install"
-   followed by "npm start"
-   A local server should be hosted on http:localhost:3000
-   Can test endpoints using POSTMAN
-   For android and production testing requires ngrok (or in future, hosting)

## Android Java Front-end

### Views
-  Login view
-  Online Match view
-  Bluetooth Match view

## Database - MongoDB hosted on atlas

### Tables
-  user_info
-  game_info (in development)

## HardWare - DE1-SOC FPGA

### RFS Module (Bluetooth and Wifi)


## Game Engine
- Written in Verilog
