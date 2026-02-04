import { Router } from "express";
import { storage } from "../storage";
import { firebaseAuth } from "../middleware/firebaseAuth";
import { insertLoveMessageSchema, insertContactInquirySchema } from "@shared/schema";

const router = Router();

// ==================== DISCUSSION FORUM ROUTES ====================

// Get forum threads
router.get("/forum/threads", async (req: any, res) => {
    try {
        const { referenceType, referenceId, limit } = req.query;
        const threads = await storage.getForumThreads(
            referenceType,
            referenceId ? parseInt(referenceId) : undefined,
            limit ? parseInt(limit) : undefined
        );
        res.json(threads);
    } catch (error) {
        console.error("Error fetching forum threads:", error);
        res.status(500).json({ message: "Failed to fetch forum threads" });
    }
});

// Get single thread with replies
router.get("/forum/threads/:id", async (req: any, res) => {
    try {
        const { id } = req.params;
        const [thread, replies] = await Promise.all([
            storage.getForumThread(parseInt(id)),
            storage.getForumReplies(parseInt(id))
        ]);

        res.json({ thread, replies });
    } catch (error) {
        console.error("Error fetching forum thread:", error);
        res.status(500).json({ message: "Failed to fetch forum thread" });
    }
});

// Create new thread
router.post("/forum/threads", firebaseAuth as any, async (req: any, res: any) => {
    try {
        const userId = req.user?.claims?.sub;
        const userEmail = req.user?.claims?.email;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title, content, referenceType, referenceId, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const threadData = {
            title,
            content,
            authorId: userId,
            authorName: userEmail || "Anonymous",
            referenceType,
            referenceId: referenceId ? parseInt(referenceId) : null,
            tags: tags || [],
        };

        const thread = await storage.createForumThread(threadData);
        res.json(thread);
    } catch (error) {
        console.error("Error creating forum thread:", error);
        res.status(500).json({ message: "Failed to create forum thread" });
    }
});

// Update thread (author or admin only)
router.patch("/forum/threads/:id", async (req: any, res) => {
    try {
        const userId = req.user?.claims?.sub;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const thread = await storage.updateForumThread(parseInt(id), req.body);
        res.json(thread);
    } catch (error) {
        console.error("Error updating forum thread:", error);
        res.status(500).json({ message: "Failed to update forum thread" });
    }
});

// Delete thread (author or admin only)
router.delete("/forum/threads/:id", async (req: any, res) => {
    try {
        const userId = req.user?.claims?.sub;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await storage.deleteForumThread(parseInt(id));
        res.json({ message: "Thread deleted successfully" });
    } catch (error) {
        console.error("Error deleting forum thread:", error);
        res.status(500).json({ message: "Failed to delete forum thread" });
    }
});

// Create reply
router.post("/forum/replies", firebaseAuth as any, async (req: any, res: any) => {
    try {
        const userId = req.user?.claims?.sub;
        const userEmail = req.user?.claims?.email;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { threadId, content, parentReplyId } = req.body;

        const replyData = {
            threadId: parseInt(threadId),
            content,
            authorId: userId,
            authorName: userEmail || "Anonymous",
            parentReplyId: parentReplyId ? parseInt(parentReplyId) : null,
        };

        const reply = await storage.createForumReply(replyData);
        res.json(reply);
    } catch (error) {
        console.error("Error creating forum reply:", error);
        res.status(500).json({ message: "Failed to create forum reply" });
    }
});

// Vote on reply
router.post("/forum/replies/:id/vote", async (req: any, res) => {
    try {
        const userId = req.user?.claims?.sub;
        const { id } = req.params;
        const { voteType } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await storage.voteForumReply(userId, parseInt(id), voteType);
        res.json({ message: "Vote recorded successfully" });
    } catch (error) {
        console.error("Error voting on forum reply:", error);
        res.status(500).json({ message: "Failed to vote on reply" });
    }
});

// ==================== CONTACT & MESSAGES ====================

router.post("/contact", async (req, res) => {
    try {
        const inquiryData = insertContactInquirySchema.parse(req.body);
        const inquiry = await storage.createContactInquiry(inquiryData);
        res.json(inquiry);
    } catch (error) {
        console.error("Error creating contact inquiry:", error);
        res.status(500).json({ message: "Failed to create contact inquiry" });
    }
});

// Love message routes (special user to admin messages)
router.post("/love-messages", async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] as string; // Firebase UID from frontend
        const userEmail = req.headers['x-user-email'] as string; // User email from frontend

        // Only allow the special user to send love messages
        if (userEmail !== 'munafsultan111@gmail.com') {
            return res.status(403).json({ message: "Access denied" });
        }

        const messageData = insertLoveMessageSchema.parse({
            ...req.body,
            fromUserId: userId,
            fromUserEmail: userEmail,
        });

        const message = await storage.createLoveMessage(messageData);
        res.json(message);
    } catch (error) {
        console.error("Error creating love message:", error);
        res.status(500).json({ message: "Failed to send love message" });
    }
});

export default router;
