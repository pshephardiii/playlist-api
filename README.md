# Playlist API 

## User Stories:

+ "As a user, I should be able to click on a navigation link to access a specific playlist."

+ "As a user, I should be able to browse available songs and add them to a desired playlist."

+ "As a user, I should land on a welcome page after logging in that has navigation links to saved playlists and index songs based on artist, album, year, or genre."

+ "As a user, I should be able to update playlists by removing or adding songs."

+ "As a user, I should be able to click on a song and land on a page that provides song information (like artist and album)."

+ "As a user, I should be able to create and delete playlists from a page that indexes all saved playlists."

+ "As a user, I should be able to click on a playlist and navigate to a page that displays all of the songs on that playlist, controls for updating/deleting the playlist, and any additional playlist information."

+ "As a user, I should be able to set my playlist to private so that only I can access/edit it."

+ "As a user, I should be able to collaborate on playlists with others."

+ "As a user, I should be able to comment on playlists made by others."

---

## App Installation Instructions:

**Global installations needed: node.js mongodb**

1. Make new directory for project and move into that directory

2. Git clone repository into directory: ``` git clone ``` *insert SSH-key here*

3. Add .env file with following command: ``` touch .env ```

4. Add MONGO URI string with desired database name and a sha256 hash as SECRET in .env file

5. To install dependencies, run the following in the repository: ``` npm i ```

6. To start app in development mode, use command: ``` npm run dev ```

---

## Additional Instructions:

To run automatic tests: ``` npm run test ```

To start app without dev mode: ``` npm run start ```

---

## Route Explanations: Playlists

---

## Route Explanations: Users

---

## Route Explanations: Songs

---

## Model Attributions Diagram

![Model Attributions Diagram](https://i.imgur.com/dRAQSbY.png)