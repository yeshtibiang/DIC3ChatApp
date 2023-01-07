const modelMessage = require("../model/message")
const modelUser = require("../model/user")

module.exports.ajouterMessage = async (req, res, next) => {
    console.log("Ajout d'un message")
    try {
        const {from, to, message} = req.body;
        const data = await modelMessage.create({
            message: {
                text: message
            },
            users: [from, to],
            sender: from
        });

        if (data) return res.json({msg: "Message ajouté"})
        return res.json({msg: "Erreur message non ajouté dans la BD"})
    }catch (e){
        next(e);
    }
}

module.exports.recevoirPublicKey = async (req, res, next) => {
    try{
        const {id} = req.body;
        const publicKey = await modelUser.findOne({id}).select("public_key")

        return res.json({
            publicKey
        })
    }catch (e) {
        next(e);
    }
}

module.exports.recevoirPrivateKey = async (req, res, next) => {
    try{
        const {id} = req.body;
        const privateKey = await modelUser.findOne({id}).select("private_key")

        return res.json({
            privateKey
        })
    }catch (e) {
        next(e);
    }
}

module.exports.recevoirMessage = async (req, res, next) => {
    try{
        const { from, to } = req.body;
        const messages = await modelMessage.find({
            users : {
                $all: [from, to],
            }
        }).sort({updatedAt: 1})

        const contenusMessages = messages.map( (msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        });

        res.json(contenusMessages);

    }catch (e) {
        next(e)
    }
}