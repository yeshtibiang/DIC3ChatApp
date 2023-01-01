const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const usersRoutes = require("./routes/usersRoutes")
const messageRoute = require("./routes/messageRoute")
const socket = require("socket.io")

const app = express()
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", usersRoutes)
app.use("/api/msg", messageRoute)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connexion à la base de donnée établie")
}).catch((err) => {
    console.log(err.message)
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})

// mettre en place socket io
const io = socket(server, {
    cors: {
        origin : "http://localhost:3000",
        credentials: true
    }
})

// pour stocker nos utilisateurs connecté
global.onlineUsers = new Map();

// pour stoker les utilisateurs avec leurs public_key
global.userByPublicKey = new Map()



io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })

    socket.on("register-key", (userId, public_key) => {
        userByPublicKey.set(userId, public_key);
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    })

})
