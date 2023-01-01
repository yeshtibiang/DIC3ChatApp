const {ajouterMessage, recevoirMessage, recevoirPublicKey, recevoirPrivateKey} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/ajoutermsg", ajouterMessage);
router.post("/recevoirmsg", recevoirMessage);
router.get("/getpublickey/:id", recevoirPublicKey)
router.get("/getprivatekey/:id", recevoirPrivateKey)

module.exports = router;