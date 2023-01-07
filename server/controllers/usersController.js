const User = require("../model/user");
// utilisons bcrypt pour hacher les mots de passes
const bcrypt = require("bcrypt");

module.exports.signUp = async (req, res, next) => {
    try{
        const { username, email, password, public_key, private_key} = req.body;

        const veriUsername = await User.findOne({username});
        if (veriUsername){
            return res.json({
                msg: "Nom d'utilisateur déjà utilisé",
                status: false
            })
        }

        const veriEmail = await User.findOne({email});
        if (veriEmail){
            return res.json({
                msg: "Email déjà utilisé",
                status: false
            })
        }

        // hachons le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // insérons le user dans la base de données
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            public_key,
            private_key
        });
        // supprimer le user.password pour éviter des attaques si on arrive à recupéer l'objet user renvoyé
        delete user.password;
        delete user.private_key;

        return res.json({
            status: true,
            user
        });
    }
    catch (e){
        next(e);
    }

}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'dic3-user', {
        expiresIn: maxAge
    });
}

module.exports.login = async (req, res, next) => {
    try{
        const { username, password} = req.body;

        const user = await User.findOne({username});
        if (!user){
            return res.json({
                msg: "Nom d'utilisateur et/ou mot de passe incorrect",
                status: false
            })
        }

        // comparons les mots de passe
        const veriPassword = bcrypt.compare(password, user.password);

        if (!veriPassword){
            return res.json({
                msg: "Nom d'utilisateur et/ou mot de passe incorrect",
                status: false
            })
        }
        // supprimer le user.password pour éviter des attaques si on arrive à recupéer l'objet user renvoyé
        delete user.password;

        // on crée un token
        // const token = createToken(user._id);
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.json({
            status: true,
            user
        })
    }
    catch (e){
        next(e);
    }

}

module.exports.logout = async (req, res, next) => {
    try{
        if (!req.params.id) return res.json({msg: "Identifiant de l'utilisateur indisponible"});
       // onlineUsers.delete(req.params.id);
        return res.status(200).send();
    }
    catch (e){
        next(e);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try{
        // on ne recupère que certaines valeurs pour ne pas envoyer le password à l'utilisateur.
        const users = await User.find({ _id: { $ne: req.params.id }}).select([
            "email", "username", "_id"
        ]);
        console.log(users);
        return res.json(users);
    }
    catch (e){
        next(e);
    }

}