//import CustomErrorHandler from "./customErrorHandler.js";
const notFound = (req, res, next) => {
    const error = new Error("Route does not exist");
    res.status(404);
    next(error);
}

const errorHandler = async (err, req, res, next) => {
    /*if (err instanceof CustomErrorHandler) {
        res.status(err.statusCode).json({message: err.message});
    }*/
    let statusCode = res.statusCode === 200 ? 404 : res.statusCode;
    let message = err.message;
    if(err.name === "CastError" && err.kind === "ObjectId"){
        statusCode = 404;
        message = "Resource not found" ;
    }
    /**default error message */
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })
    
}

export  {notFound, errorHandler};