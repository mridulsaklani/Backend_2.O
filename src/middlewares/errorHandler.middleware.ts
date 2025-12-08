import { ErrHandler } from "../types/type.constants";

const errorHandler: ErrHandler = (err, req, res, next) => {
  
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || null ,
    
  });
};

export default errorHandler;
