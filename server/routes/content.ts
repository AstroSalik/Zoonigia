import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// ==================== WORKSHOPS ====================

router.get("/workshops", async (req, res) => {
    try {
        let workshops = await storage.getWorkshops();

        // Remove all existing workshops from featured first
        for (const workshop of workshops) {
            if (workshop.isFeatured) {
                await storage.updateWorkshop(workshop.id, {
                    isFeatured: false,
                    featuredOrder: 0
                });
            }
        }

        // Create Featured Workshop if it doesn't exist
        let featuredWorkshop = workshops.find(w => w.title === "Space Technology Workshop");
        if (!featuredWorkshop) {
            featuredWorkshop = await storage.createWorkshop({
                title: "Space Technology Workshop",
                description: "Hands-on workshop covering satellite technology, rocket propulsion, and space mission design. Learn from industry experts and work on real space projects. Instructor: Dr. Mitchell. Duration: 3 days. Requirements: Basic physics knowledge, laptop required. Outcomes: Certificate of completion, hands-on project portfolio",
                type: "expert_session",
                maxParticipants: 30,
                price: "1500.00",
                startDate: "2025-03-15",
                endDate: "2025-03-17",
                location: "Zoonigia Innovation Center",
                isFeatured: true,
                featuredOrder: 3,
            });
        } else {
            await storage.updateWorkshop(featuredWorkshop.id, {
                isFeatured: true,
                featuredOrder: 3
            });
        }

        res.json(workshops);
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({ message: "Failed to fetch workshops" });
    }
});

router.get("/workshops/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const workshop = await storage.getWorkshopById(id);
        if (!workshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }
        res.json(workshop);
    } catch (error) {
        console.error("Error fetching workshop:", error);
        res.status(500).json({ message: "Failed to fetch workshop" });
    }
});

// ==================== COURSES ====================

router.get("/courses", async (req, res) => {
    try {
        let courses = await storage.getCourses();

        // Remove Introduction to Space Science from featured
        const spaceScienceCourse = courses.find(c => c.title === "Introduction to Space Science");
        if (spaceScienceCourse) {
            await storage.updateCourse(spaceScienceCourse.id, {
                isFeatured: false,
                featuredOrder: 0
            });
        }

        // Remove Advanced Robotics & AI from featured
        const advancedRoboticsCourse = courses.find(c => c.title === "Advanced Robotics & AI");
        if (advancedRoboticsCourse) {
            await storage.updateCourse(advancedRoboticsCourse.id, {
                isFeatured: false,
                featuredOrder: 0
            });
        }

        // Remove Advanced Space Technology from featured if it exists
        const advancedSpaceCourse = courses.find(c => c.title === "Advanced Space Technology");
        if (advancedSpaceCourse) {
            await storage.updateCourse(advancedSpaceCourse.id, {
                isFeatured: false,
                featuredOrder: 0
            });
        }

        // Add sample courses if none exist
        if (courses.length === 0) {
            await storage.createCourse({
                title: "Introduction to Space Science",
                description:
                    "Explore the fundamentals of frontier sciences including planetary motion, stellar evolution, and cosmic phenomena. Perfect for beginners looking to understand the universe.",
                field: "astronomy",
                level: "beginner",
                duration: "8 weeks",
                price: "2999.00",
                imageUrl: "https://i.pinimg.com/1200x/f8/6e/f5/f86ef5d275ce8856166fdf1c2e5138c0.jpg",
                instructorName: "Mr. Salik Riyaz",
                status: "published",
                category: "Space Science",
                totalLessons: 12,
                totalDuration: 720,
                isFeatured: true,
                featuredOrder: 1,
                learningObjectives: [
                    "Understand the structure and evolution of the universe",
                    "Learn about planetary systems and their characteristics",
                    "Explore stellar lifecycles and cosmic phenomena",
                    "Develop skills in astronomical observation and data analysis",
                ],
                prerequisites: [
                    "Basic mathematics knowledge",
                    "Interest in science and astronomy",
                ],
            });

            await storage.createCourse({
                title: "Advanced Robotics & AI",
                description:
                    "Dive deep into robotics engineering and artificial intelligence. Learn to build autonomous robots, implement machine learning algorithms, and create intelligent systems.",
                field: "robotics",
                level: "advanced",
                duration: "12 weeks",
                price: "4999.00",
                imageUrl: "/api/placeholder/300/200",
                instructorName: "Prof. Reena Sharma",
                status: "published",
                category: "Robotics",
                totalLessons: 18,
                totalDuration: 1080,
                learningObjectives: [
                    "Master advanced robotics concepts and algorithms",
                    "Implement AI and machine learning in robotic systems",
                    "Build and program autonomous robots",
                    "Understand sensor integration and control systems",
                ],
                prerequisites: [
                    "Programming experience in Python or C++",
                    "Basic understanding of electronics",
                    "Linear algebra and calculus knowledge",
                ],
            });

            // Quantum Computing Fundamentals removed from seeding


            courses = await storage.getCourses();

            // Add sample lessons for the first course
            if (courses.length > 0) {
                const firstCourse = courses[0];

                // Create modules for the first course
                await storage.createCourseModule({
                    courseId: firstCourse.id,
                    title: "Introduction to the Universe",
                    description: "Basic concepts and overview of frontier sciences",
                    orderIndex: 1,
                });

                await storage.createCourseModule({
                    courseId: firstCourse.id,
                    title: "Solar System Exploration",
                    description: "Study our solar system and its components",
                    orderIndex: 2,
                });

                await storage.createCourseModule({
                    courseId: firstCourse.id,
                    title: "Stellar Evolution",
                    description: "Learn about star formation and lifecycle",
                    orderIndex: 3,
                });

                // Create sample lessons for the first course
                await storage.createCourseLesson({
                    courseId: firstCourse.id,
                    title: "Welcome to Frontier Sciences",
                    description:
                        "Introduction to the course and frontier sciences fundamentals",
                    content:
                        "<p>Welcome to our comprehensive frontier sciences course! In this lesson, we'll explore the basic principles of astronomy and space exploration.</p><p>You'll learn about the scale of the universe, from planets to galaxies, and discover how scientists study celestial objects.</p>",
                    videoUrl: "https://example.com/intro-video",
                    duration: 30,
                    orderIndex: 1,
                    type: "video",
                    isPreview: true,
                    resources: ["Course syllabus", "Space science glossary"],
                });

                await storage.createCourseLesson({
                    courseId: firstCourse.id,
                    title: "The Scale of the Universe",
                    description: "Understanding distances and sizes in space",
                    content:
                        "<p>The universe is incredibly vast, with distances measured in light-years and astronomical units. This lesson covers the scale from Earth to the observable universe.</p>",
                    videoUrl: "https://example.com/scale-video",
                    duration: 45,
                    orderIndex: 2,
                    type: "video",
                    resources: ["Scale comparison chart", "Interactive universe map"],
                });

                await storage.createCourseLesson({
                    courseId: firstCourse.id,
                    title: "Planetary Motion Laws",
                    description: "Kepler's laws and orbital mechanics",
                    content:
                        "<p>Johannes Kepler discovered three fundamental laws that describe planetary motion. These laws revolutionized our understanding of the solar system.</p>",
                    duration: 40,
                    orderIndex: 3,
                    type: "text",
                    resources: ["Kepler's laws worksheet", "Orbital calculator"],
                });

                await storage.createCourseLesson({
                    courseId: firstCourse.id,
                    title: "Solar System Overview",
                    description: "Tour of planets, moons, and other objects",
                    content:
                        "<p>Our solar system contains eight planets, numerous moons, asteroids, and comets. Each world has unique characteristics and history.</p>",
                    videoUrl: "https://example.com/solar-system-video",
                    duration: 60,
                    orderIndex: 4,
                    type: "video",
                    resources: ["Planet fact sheets", "Solar system timeline"],
                });

                await storage.createCourseLesson({
                    courseId: firstCourse.id,
                    title: "Knowledge Check: Solar System",
                    description: "Test your understanding of solar system basics",
                    content:
                        "<p>Complete this quiz to test your knowledge of the solar system and planetary characteristics.</p>",
                    duration: 20,
                    orderIndex: 5,
                    type: "quiz",
                    resources: ["Quiz reference guide"],
                });
            }
        }

        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});

router.get("/courses/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const course = await storage.getCourseById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Failed to fetch course" });
    }
});

// LMS API routes
router.get("/courses/:courseId/modules", async (req, res) => {
    try {
        const modules = await storage.getCourseModules(
            parseInt(req.params.courseId),
        );
        res.json(modules);
    } catch (error) {
        console.error("Error fetching course modules:", error);
        res.status(500).json({ message: "Failed to fetch course modules" });
    }
});

router.get("/courses/:courseId/lessons", async (req, res) => {
    try {
        const lessons = await storage.getCourseLessons(
            parseInt(req.params.courseId),
        );
        res.json(lessons);
    } catch (error) {
        console.error("Error fetching course lessons:", error);
        res.status(500).json({ message: "Failed to fetch course lessons" });
    }
});

router.get("/lessons/:id", async (req, res) => {
    try {
        const lesson = await storage.getLessonById(parseInt(req.params.id));
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        res.json(lesson);
    } catch (error) {
        console.error("Error fetching lesson:", error);
        res.status(500).json({ message: "Failed to fetch lesson" });
    }
});

router.get("/courses/:courseId/quizzes", async (req, res) => {
    try {
        const quizzes = await storage.getCourseQuizzes(
            parseInt(req.params.courseId),
        );
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching course quizzes:", error);
        res.status(500).json({ message: "Failed to fetch course quizzes" });
    }
});

router.get("/courses/:courseId/reviews", async (req, res) => {
    try {
        const reviews = await storage.getCourseReviews(
            parseInt(req.params.courseId),
        );
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching course reviews:", error);
        res.status(500).json({ message: "Failed to fetch course reviews" });
    }
});

// ==================== CAMPAIGNS ====================

router.get("/campaigns", async (req, res) => {
    try {
        let campaigns = await storage.getCampaigns();

        // Remove Zoonigia Asteroid Search Campaign from featured
        const asteroidCampaign = campaigns.find(c => c.title === "Zoonigia Asteroid Search Campaign");
        if (asteroidCampaign) {
            await storage.updateCampaign(asteroidCampaign.id, {
                isFeatured: false,
                featuredOrder: 0
            });
        }

        // Remove School Education Partnership Program from featured (if it exists)
        const schoolPartnershipCampaign = campaigns.find(c => c.title === "School Education Partnership Program");
        if (schoolPartnershipCampaign) {
            await storage.updateCampaign(schoolPartnershipCampaign.id, {
                isFeatured: false,
                featuredOrder: 0
            });
        }

        // Youth Ideathon removed from auto-seeding

        // Add sample campaigns if none exist
        if (campaigns.length === 0) {
            await storage.createCampaign({
                title: "Zoonigia Asteroid Search Campaign",
                description:
                    "Collaborate with NASA Citizen Science and IASC to discover real asteroids and name them officially",
                type: "asteroid_search",
                field: "Astronomy",
                duration: "16 weeks",
                startDate: "2025-08-17",
                endDate: "2025-11-23",
                partner: "NASA • IASC • University of Hawaii",
                status: "accepting_registrations",
                progress: 20,
                price: "300.00",
                isFeatured: true,
                featuredOrder: 1,
            });

            campaigns = await storage.getCampaigns();
        }

        // Filter out School Partnership from the list returned to clients
        campaigns = campaigns.filter(c =>
            c.title !== "School Education Partnership Program" &&
            !c.title.toLowerCase().includes("school") &&
            !c.title.toLowerCase().includes("partnership")
        );

        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ message: "Failed to fetch campaigns" });
    }
});

router.get("/campaigns/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const campaign = await storage.getCampaignById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        res.json(campaign);
    } catch (error) {
        console.error("Error fetching campaign:", error);
        res.status(500).json({ message: "Failed to fetch campaign" });
    }
});

// ==================== BLOG POSTS ====================

router.get("/blog-posts", async (req, res) => {
    try {
        const posts = await storage.getBlogPosts();
        res.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Failed to fetch blog posts" });
    }
});

router.get("/blog-posts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const post = await storage.getBlogPostById(id);
        if (!post) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        res.status(500).json({ message: "Failed to fetch blog post" });
    }
});

// ==================== FEATURED ====================

router.get("/featured", async (req, res) => {
    try {
        const featuredItems = await storage.getFeaturedItems();
        res.json(featuredItems);
    } catch (error) {
        console.error("Error fetching featured items:", error);
        res.status(500).json({ message: "Failed to fetch featured items" });
    }
});

export default router;
