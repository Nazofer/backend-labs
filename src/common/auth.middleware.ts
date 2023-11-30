import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from './middleware.interface';
import jsonwebtoken, { JwtPayload, VerifyErrors } from 'jsonwebtoken'; // Import JwtPayload
import 'dotenv/config';

// Define an interface for the JWT payload
interface CustomJwtPayload extends JwtPayload {
  email: string;
}

export class AuthMiddleware implements IMiddleWare {
  private secret: string = process.env.JWT_SECRET || '';

  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      jsonwebtoken.verify(token, this.secret, (err, payload) => {
        if (err) {
          next();
        } else if (payload as CustomJwtPayload) {
          req.email = (payload as CustomJwtPayload).email;
          next();
        }
      });
    } else {
      next();
    }
  }
}
