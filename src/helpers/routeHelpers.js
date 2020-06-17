const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return(req,res,next) => {
            const result = Joi.validate(req.body, schema);
            console.log(result.error);
            if(result.error) {
                return res.status(422).send({ error : 'Enter valid email and password'})
            }

            // req.value.body instead req.body
            if(!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
           
            email: Joi.string().email().required(),
            
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
         
        })
    },

    signInSchema: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
         
        })
    },

    confirmPassword: {
        authSchema: Joi.object().keys({
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
         })
    },

    editProfile: {
        authSchema: Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            contactno :Joi.number().min(1000000000).max(9999999999).required(),
            address: Joi.string().required()
         
        })
    },


}