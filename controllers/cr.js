const connection = require('../database/db');

exports.save = (req, res) => {
    const user = req.body.usuario;
    const coment = req.body.coment;
    console.log(user + " - " + coment);
}