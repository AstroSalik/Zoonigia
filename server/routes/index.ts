import type { Express } from "express";
import { createServer, type Server } from "http";
import authRouter from "./auth";
import adminRouter from "./admin";
import contentRouter from "./content";
import enrollmentsRouter from "./enrollments";
import usersRouter from "./users";
import communicationRouter from "./communication";
import novaRouter from "./nova";
import resourcesRouter from "./resources";

export async function registerRoutes(app: Express): Promise<Server> {
    // Mount the sub-routers

    // --- PRIORITY ROUTES ---
    // Nova AI -> /api/nova 
    // MOVED TO TOP: This must be defined before generic /api routes to avoid being treated as a slug
    app.use("/api/nova", novaRouter);

    // Auth routes -> /api/auth/*
    app.use("/api/auth", authRouter);

    // Admin routes -> /api/admin/*
    app.use("/api/admin", adminRouter);

    // Resources -> /api/resources
    app.use("/api/resources", resourcesRouter);

    // --- GENERIC ROUTES (Catch-alls) ---
    // These must come LAST because they use generic paths like /api/:slug or /api/:id

    // Content routes (Workshops, Courses, Campaigns, Blog Posts, Featured) -> /api/*
    app.use("/api", contentRouter);

    // Enrollment & Payment routes -> /api/*
    app.use("/api", enrollmentsRouter);

    // User centric routes -> /api/*
    app.use("/api", usersRouter);

    // Communication routes (Forum, Contact, Love Messages) -> /api/*
    app.use("/api", communicationRouter);

    const httpServer = createServer(app);
    return httpServer;
}

// /api/nova/chat