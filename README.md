-- Playlist API --

USER STORIES:

(a) "As a user, I should be able to click on a navigation link to access a specific playlist."

(b) "As a user, I should be able to browse available songs and add them to a desired playlist upon click."

(c) "As a user, I should land on a welcome page after logging in that has navigation links to saved playlists and search for songs based on artist, album, year, or genre."

(d) "As a user, I should be able to update playlists by editing the order of the songs, removing songs, or adding new songs."

(e) "As a user, I should be able to click on a song and land on a page that provides song information (like artist and album) and tools for playing that song (play, pause, volume control, etc.)."

(f) "As a user, I should be able to create and delete playlists from a page that indexes all saved playlists."

(g) "As a user, I should be able to click on a playlist and navigate to a page that displays all of the songs on that playlist, controls for updating/deleting the playlist, and any additional playlist information."

----

APP INSTALLATION INSTRUCTIONS:

*** Global installations needed: node.js mongodb ***

1. Make new directory for project

2. Git clone repository into directory

3. Run npm init -y in repository

4. Create .gitignore and .env files

5. Add node_modules/ and .env to .gitignore files

6. Install dependencies: npm install express mongoose dotenv jsonwebtoken bcrypt

7. Install dev dependencies: npm install jest supertest mongodb-memory-server nodemon morgan --save-dev

8. Insert Mongo URI in .env with desired database name

9. Update package.json scripts with "dev": "nodemon" and "test":"jest"

10. Add "jest": {"testEnvironment": "node} below scripts block

11. To start app in development mode, use command npm run dev

----

POSTMAN MANUAL TESTING INSTRUCTIONS:

I. Run the app in dev mode

II. Use the same PORT that's running the app

III. The URL and request type should be set according to the route/api endpoint you'd like to test

IV. In "Body", select "raw" and navigate to the dropdown menu on the right to select "JSON"

V. To begin, it'd be wise to create an instance of a model (or more) to test if you can then successfully login that user

VI. Copy token and try to update/delete user without authorization

VII. Paste token under Authorization with type Bearer Token then try to update/delete user

VIII. Check CRUD operations of another model

----

ADDITIONAL INSTRUCTIONS:

To run automatic tests: npm run test

To start app without dev mode: npm run start

----
