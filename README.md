# Playlist API 

## Description:

Foundation for a social media application centered around music playlists. Users can share, copy, and collaborate on custom playlists, comment and "like" playlists made by others, and add fellow users as contacts. Basic authorization and privacy functionality is included.

NOTE: songs are not currently seeded in, so they would need to be added manually to your desired database.

## User Stories:

+ "As a user, I should be able to click on a navigation link to access a specific playlist."

+ "As a user, I should be able to browse available songs and add them to a desired playlist."

+ "As a user, I should land on a welcome page after logging in that has navigation links to saved playlists and index songs based on title, artist, album, or genre."

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

2. Git clone repository into directory: ``` git clone ``` *insert SSH-key git clone link here*

3. Add .env file with following command: ``` touch .env ```

4. Add MONGO URI string with desired database name and a sha256 hash as SECRET in .env file

5. To install dependencies, run the following in the repository: ``` npm i ```

6. To start app in development mode, use command: ``` npm run dev ```

---

## Additional Instructions:

To run automated tests: ``` npm run test ```

To start app without dev mode: ``` npm run start ```

---

## Route Explanations: Playlists

#### GET Routes

##### /playlists

Indexes all public playlists

##### /playlists/:userId

Indexes all playlists owned or shared by a particular user

##### /playlists/:userId/shared

Indexes all playlists that were shared with user but created by another

##### /playlists/:userId/:foundPlaylistId

Shows a specified public playlist

---

#### POST Routes

##### /playlists

Returns a new playlist (requires title in req.body):

```
{
    "playlist": {
        "title": "new playlist",
        "public": false,
        "user": "65b58af441ae5c2f3da09f14",
        "songs": [],
        "comments": [],
        "sharedWith": [],
        "cloned": [],
        "_id": "65b9ac149af84bd7af2917d6",
        "__v": 0
    }
}   
```

##### /playlists/playlistId/songs/add

Adds a song object (found in req.body) to the playlist's songs array

##### /playlists/playlistId/songs/remove

Removes a song object (found in req.body) from the playlist's songs array

##### /playlists/:userId/:foundPlaylistId/clone

Creates a copy of the found (public) playlist for the user to add to playlists array

##### /playlists/:userId/:foundPlaylistId/comment

Posts a comment written by the user on the found playlist, adds comment ID to playlist and user comments array, and adds playlist ID to the comment's playlists array:

```
{
    "comment": {
        "content": "nice playlist!",
        "user": "65b58af441ae5c2f3da09f14",
        "playlist": "65b578f3f60eb294f91267e6",
        "_id": "65b9afa8513eda07a7196bd4",
        "__v": 0
    }
}
```

##### /playlists/:playlistId/share

Shares a playlist with another user specified in the req.body

##### /playlists/:userId/:foundPlaylistId

Adds the playlist ID to the user's likedPlaylists array and adds one to the number of the playlist's likes

If user attempts to like a playlist after having already liked it earlier, the route will have the opposite effect (the user will "unlike" the playlist)

---

#### PUT and DELETE Routes

##### /playlists/:playlistId

Updates playlist with specifications in req.body

##### /playlists/:userId/:playlistId

Deletes a playlist

---

## Route Explanations: Users

#### GET Routes

##### /users

Indexes all users

##### /users/:userId/contacts

Indexes all of the user's contacts

##### /users/:id

Show's a specified user

---

#### POST Routes

##### /users

Returns a new user (requires name, email, and password in req.body):

```
{
    "user": {
        "name": "Paul",
        "email": "Paul@Paul.Paul",
        "password": "$2b$08$tHbfF6OK3yfBEF6usSNNDurNELqqCzDTrmxmPm8L20k3u7sRCXPEO",
        "contacts": [],
        "playlists": [],
        "comments": [],
        "_id": "65b9b1dd513eda07a7196bd8",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI5YjFkZDUxM2VkYTA3YTcxOTZiZDgiLCJpYXQiOjE3MDY2Njg1MDl9.6A5kYDfl8Utb4Ch0Qm114RqxwIeiQL9G6zz03O8hXX8"
}
```

##### /users/login

Logs in a user with email and password in req.body

##### /users/:userId/contacts/add/:contactId

Adds a new contact (contactId) into the user's (userId) contacts array

##### /users/:userId/contacts/remove/:contactId

Removes an existing contact (contactId) from the user's (userId) contacts array

---

#### PUT and DELETE Routes

#### /users/:userId

PUT: Updates a user with specifications in req.body

DELETE: Deletes a specified user object

---

## Route Explanations: Songs

All routes index or show song object(s):

```
{
    {
        "_id": "65ac00b1614da698439ee4e4",
        "title": "Have a Cigar",
        "artist": "Pink Floyd",
        "album": "Wish you were Here",
        "genre": "Classic Rock",
        "__v": 2,
        "playlists": []
    }
}    
```

##### /songs

Indexes all available songs

##### /songs/title/:title

Indexes all songs with specified title

##### /songs/artists/:artist

Indexes all songs with specified artist

##### /songs/albums/:album

Indexes all songs with specified album title

##### /songs/artists/:artist/albums/:album

Indexes all songs on a specific album (won't include songs on albums with same title by a different artist)

##### /songs/genre/:genre

Indexes all songs with a specified genre

##### /songs/:id

Shows a specified song

---

## Model Attributions Diagram

![Model Attributions Diagram](https://i.imgur.com/6fkFn2s.png)

---

## Wireframe

##### A quick (and ugly!) mockup of what a shown playlist may look like to the owner

![Wireframe](https://i.imgur.com/jpYLpHv.png)