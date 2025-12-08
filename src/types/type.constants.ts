import {  Request, Response, NextFunction } from "express";
import { ClientSession } from "mongoose";
import {apiError} from "../utils/apiError.utils"


type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void> | void | Response;


type ErrHandler = (err: any, req: Request, res: Response, next: NextFunction)=> Response | void

 type Projection = string;

type Session = ClientSession | null
type Sort = Record<string, 1 | -1> | null;;

type Populate = string | Array<string> | null
type Data = {[key: string]: any}
type Filters = {[key: string]: any}

type ResponsePromise = Promise<Response>
type ResourceType = "image" | "video" | "raw"


export  { Controller, Projection, Sort, Session, Populate, Data, Filters, ErrHandler, ResponsePromise }

