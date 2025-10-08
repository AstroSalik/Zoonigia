import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../firebaseAdmin.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    claims: {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    };
  };
}

export const firebaseAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Add user info to request object
    req.user = {
      claims: {
        sub: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
      }
    };
    
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
