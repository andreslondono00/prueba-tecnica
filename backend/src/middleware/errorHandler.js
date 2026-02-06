const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación Joi
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.details
        });
    }

    // Error de MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry. Resource already exists.'
        });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({
            success: false,
            message: 'Referenced entity not found'
        });
    }

    // Error de negocio personalizado
    if (err.code === 'BUSINESS_ERROR') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Error general
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
    });
};

module.exports = errorHandler;