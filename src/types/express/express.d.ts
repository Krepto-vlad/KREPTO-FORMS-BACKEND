import { Request as ExpressRequest } from "express";
declare module "express" { 
    export interface Request {
        user?: string | jwt.JwtPayload | User;
    }
  }


declare namespace jwt {
    export interface JwtPayload {
        [key: string]: any;
    }
}
export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    status: string;
    lastLogin: string; 
  }

