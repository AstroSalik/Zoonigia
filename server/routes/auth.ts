import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Firebase user sync endpoint - creates/updates user in database when Firebase user signs in
router.post('/sync-user', async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ message: "Missing required user data" });
        }

        // Check if this is a designated admin email using Environment Variable or strict DB check
        // We default to false and let the DB or manual update handle admin promotion.
        // Use ADMIN_EMAILS env var if available for initial setup
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

        const userData = {
            id: uid,
            email: email,
            firstName: displayName?.split(' ')[0] || null,
            lastName: displayName?.split(' ').slice(1).join(' ') || null,
            profileImageUrl: photoURL || null,
            userType: 'student' as const,
            isAdmin: adminEmails.includes(email.toLowerCase())
        };

        const user = await storage.upsertUser(userData);
        res.json(user);
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ message: "Failed to sync user" });
    }
});

// Get current user by Firebase UID or email
router.get('/user/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;

        // Cache headers for user data (5 minutes)
        res.set({
            'Cache-Control': 'private, max-age=300',
            'ETag': `user-${uid}-${Date.now()}`
        });

        const user = await storage.getUser(uid);

        // If not found, that's okay, return 404 handled by frontend
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

// Get user by email (for Firebase sync)
router.get('/user-by-email/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);

        // Cache headers
        res.set({
            'Cache-Control': 'private, max-age=300',
            'ETag': `email-${email.replace('@', '-')}-${Date.now()}`
        });

        const user = await storage.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

export default router;
