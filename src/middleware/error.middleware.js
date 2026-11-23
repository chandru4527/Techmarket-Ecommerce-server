// Handle routes that do not exist
export const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Handle application errors
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // MongoDB duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        message = `${Object.keys(err.keyValue)[0]} already exists`;
    }

    // MongoDB validation
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }

    // JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = err.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid token";
    }

    // Zod validation
    if (err.name === "ZodError") {
        statusCode = 400;
        message = err.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};