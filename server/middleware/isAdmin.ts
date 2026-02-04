import { storage } from "../storage";
import { type Request, type Response, type NextFunction } from "express";

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.headers['x-user-id'] || req.headers['X-User-ID']; // Firebase UID from frontend

        // For development, allow access if no user ID is provided (only if explicitly set in env, defaulting to strict)
        // REMOVED unsafe development bypass to ensure security.

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // For Firebase auth, userId is the Firebase UID
        // We need to find the user in our DB

        // Get all users and find the one with matching Firebase UID or admin email
        const allUsers = await storage.getAllUsers();
        let user = allUsers.find(u => u.id === userId);

        // Fallback: Check if this Firebase UID belongs to the primary admin email explicitly
        // This is a safety net if the user record isn't fully synced yet but we know the UID maps to the admin
        // Ideally this should be handled by the database record only.

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Admin access required" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({ message: "Failed to verify admin status" });
    }
};
