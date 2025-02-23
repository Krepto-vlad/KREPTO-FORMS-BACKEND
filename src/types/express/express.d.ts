import { Request as ExpressRequest } from "express";
declare module "express" { 
    export interface Request {
        user?: {
            id: string;
            name: string;
            surname: string;
            email: string;
            status: string;
            lastLogin: string;
          } | jwt.JwtPayload;
    }
  }


declare namespace jwt {
    export interface JwtPayload {
        [key: string]: any;
    }
}

