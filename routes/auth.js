const router = require('express').Router();

users = [];

router.get('/login' , (req , res) => {
    res.send("Please login!");
});

router.get('/register' , (req , res) => {
    res.send("Please register!");
});

router.post('/register' , (req , res) => {
    const {name, email, password} = req.body;
    if (email && password)
    {
        let userExists = false;
        users.forEach(element => {
            if (element.email == email) 
            {
                userExists = true;
            }
        });
        if (userExists) return res.sendStatus(400);
        const userDB = {email , name , password};
        users.push(userDB);
        req.session.user = userDB;
        return res.redirect('/');
    }
    return res.sendStatus(400);
});

module.exports = router;