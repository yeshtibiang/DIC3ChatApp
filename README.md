## DIC3 chat app

Chat web application

### Requirements

- Node.js
- npm (download node.js url: https://nodejs.org/en/download/)
- MongoDB (download url: https://www.mongodb.com/try/download/community) & MongoDB Compass to manage the database easily (download url: https://www.mongodb.com/try/download/compass)
- or MongoDB Atlas (cloud database) (url: https://www.mongodb.com/cloud/atlas)

### Installation

- Clone the repository
- Install dependencies with `npm install` in the public and server directories
- configure the database by setting the `MONGO_URI` environment variable to the MongoDB connection string (you can use MongoDB Compass to get the connection string)
- if you want to use MongoDB Atlas, you can set the `MONGO_URI` environment variable to the MongoDB Atlas connection string
- run the server with `npm start` in the server directory
- run the client with `npm start` in the public directory
