const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();
const { validateBody, schemas, signInSchema, confirmPassword, editProfile } = require('../helpers/routeHelpers');

router.post('/signup', async (req,res) => {
    const { email, password, confirmPassword } = req.body;
    // console.log(email,password,confirmPassword);

    if(password != confirmPassword){
        return res.status(422).send({ error: 'Password do not match'});
    }

    try{
        const user = new User ({ email, password });
        console.log('user',user);
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');

        res.send({ token });
    } catch (err) {
        console.log(err);
        return res.status(422).send({ error: err.message});
    }
});


router.post('/signin', async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password'});
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(422).send({error:'Invalid email or password'});
    }

    try{
        await user.comparePassword(password);
        const token = jwt.sign({ userId : user._id }, 'MY_SECRET_KEY' );

        res.send({ token });
    } catch (err){
        return res.status(422).send({ error:'Invalid password or email'});
    }

})

module.exports = router;