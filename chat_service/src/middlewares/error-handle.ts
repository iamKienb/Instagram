import { Request, Response, NextFunction } from "express";
import HttpException from "../core/httpException";
import HttpResponse from "../core/httpResponse"

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    return res
      .status(error.statusCode)
      .json(new HttpResponse(error.statusCode, error.message, null));
  } else {
    // Handle generic server errors
    console.error(error);
    return res
      .status(500)
      .json(new HttpResponse(500, "Something went wrong", null));
  }
};
 
export default errorHandler;
