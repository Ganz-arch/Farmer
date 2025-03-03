"use strict";

// Development error handling: includes stack trace for debugging
const devErrors = (res, error) => {
    return res.status(error.statusCode).json({
        status: error.status,
        statusCode: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error,
    });
};
// Production error handling: hides details for security, only shows operation-specific messages
const prodErrors = (res, error) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    }
    else {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again later.',
        });
    }
};
// // Validation error handler: handles validation errors if applicable
// const validateErrorHandler = (err) => {
//     if (err.errors) {
//         const errors = Object.values(err.errors).map((val) => val.message);
//         const errorMessage = errors.join('. ');
//         const msg = `Invalid input: ${errorMessage}`;
//         return new CustomError_1.default(msg, 422, 'fail');
//     }
//     return err;
// };
// Duplicate error handler for PostgreSQL specific errors (23505: unique violation)
const duplicateErrorHandler = (err) => {
    if (err.code === '23505' && err.constraint === 'users_email_key') { // Assuming the constraint name for email is 'users_email_key'
        let msg = `${err.detail} is already in use, Please use another email.`;
        return res.status(422).json({message:msg,status:'fail'});
    }
    return err;
};
// Cast error handler for PostgreSQL specific errors (e.g., invalid syntax)
const castErrorHandler = (err) => {
    if (err.code === '22P02') { // PostgreSQL invalid input syntax error (e.g., invalid UUID or invalid column value)
        const msg = `Invalid input syntax for the field: ${err.message}`;
        return res.status(422).json({message:msg,status:'fail'});;
    }
    return err;
};
// Undefined column error handler (PostgreSQL: 42703)
const undefinedColumnErrorHandler = (err) => {
    if (err.code === '42703') { // PostgreSQL undefined column error
        const msg = `Undefined column: ${err.message}`;
        return res.status(422).json({message:msg,status:'fail'});;
    }
    return err;
};
// Main error handling middleware
exports.default = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    // Development environment error handling
    if (process.env.NODE_ENV === 'development') {
        devErrors(res, error);
    }
    else if (process.env.NODE_ENV === 'production') {
        // Handle PostgreSQL-specific errors
        if (error.code === '23505')
            error = duplicateErrorHandler(error); // Unique violation
        if (error.code === '22P02')
            error = castErrorHandler(error); // Invalid input syntax
        if (error.code === '42703')
            error = undefinedColumnErrorHandler(error); // Undefined column
        // Handle other common error types
        if (error.name === 'CastError')
            error = castErrorHandler(error); // Mongoose cast error
        if (error.name === 'ValidationError')
            error = validateErrorHandler(error); // Validation error
        // Send production errors
        prodErrors(res, error);
    }
    next()
};
