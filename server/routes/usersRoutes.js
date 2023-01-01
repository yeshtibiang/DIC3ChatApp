const {signUp, login, getAllUsers, logout} = require("../controllers/usersController");
const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);



router.get("/logout/:id", logout);
router.get("/allusers/:id", getAllUsers)

module.exports = router;