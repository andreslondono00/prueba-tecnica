const Joi = require('joi');
const validators = require('../utils/validators');

const validate = (validator, property = 'body') => {
    return (req, res, next) => {
        const { error } = validator.validate(req[property]);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

module.exports = validate;