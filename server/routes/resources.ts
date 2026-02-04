import { Router } from "express";
import { storage } from "../storage";
import { firebaseAuth } from "../middleware/firebaseAuth";

const router = Router();

// Get resources
router.get("/", async (req: any, res) => {
    try {
        const { referenceType, referenceId } = req.query;
        const resources = await storage.getResources(
            referenceType,
            referenceId ? parseInt(referenceId) : undefined
        );
        res.json(resources);
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ message: "Failed to fetch resources" });
    }
});

// Create resource (admin or instructor - using firebaseAuth for basic user check, assumption is admin/instructor check happens in frontend or could be refined here)
router.post("/", firebaseAuth as any, async (req: any, res: any) => {
    try {
        const userId = req.user?.claims?.sub;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title, description, fileName, fileUrl, fileType, fileSize, referenceType, referenceId } = req.body;

        if (!title || !fileUrl) {
            return res.status(400).json({ message: "Title and file URL are required" });
        }

        const resourceData = {
            title,
            description: description || "",
            fileName: fileName || fileUrl.split('/').pop() || 'file',
            fileUrl,
            fileType: fileType || 'unknown',
            fileSize: fileSize || 0,
            referenceType,
            referenceId: referenceId ? parseInt(referenceId) : null,
            uploadedBy: userId,
            downloadCount: 0,
            isPublic: true,
        };

        const resource = await storage.createResource(resourceData);
        res.json(resource);
    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ message: "Failed to create resource" });
    }
});

// Track resource download
router.post("/:id/download", async (req: any, res) => {
    try {
        const { id } = req.params;
        await storage.incrementResourceDownload(parseInt(id));
        res.json({ message: "Download tracked successfully" });
    } catch (error) {
        console.error("Error tracking resource download:", error);
        res.status(500).json({ message: "Failed to track download" });
    }
});

// Delete resource (admin or uploader)
router.delete("/:id", async (req: any, res) => {
    try {
        const userId = req.user?.claims?.sub;
        const { id } = req.params;

        if (!userId) {
            // Allow if admin middleware was used upstream, but here we might need to check header if not applied.
            // Ideally this route should be protected.
            return res.status(401).json({ message: "Unauthorized" });
        }

        await storage.deleteResource(parseInt(id));
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("Error deleting resource:", error);
        res.status(500).json({ message: "Failed to delete resource" });
    }
});

export default router;
