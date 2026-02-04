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

    // Auth routes -> /api/auth/*
    app.use("/api/auth", authRouter);

    // Admin routes -> /api/admin/*
    app.use("/api/admin", adminRouter);

    // Content routes (Workshops, Courses, Campaigns, Blog Posts, Featured) -> /api/*
    // These are public GET routes generally
    app.use("/api", contentRouter);

    // Enrollment & Payment routes -> /api/*
    // These often share prefixes with content (e.g. /api/courses/enroll) 
    // so we mount them at /api as well. Express will match sequentially/specifically.
    app.use("/api", enrollmentsRouter);

    // User centric routes -> /api/*
    // (e.g. /api/user/dashboard, /api/users, /api/leaderboard)
    app.use("/api", usersRouter);

    // Communication routes (Forum, Contact, Love Messages) -> /api/*
    // (e.g. /api/forum/threads, /api/contact)
    app.use("/api", communicationRouter);

    // Nova AI -> /api/nova
    app.use("/api/nova", novaRouter);

    // Resources -> /api/resources
    app.use("/api/resources", resourcesRouter);

    const httpServer = createServer(app);
    return httpServer;
}
