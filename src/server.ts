import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/env.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import userRoutes from "./routes/user.routes.ts";
import adminRoutes from "./routes/admin.routes.ts";

import { auth } from "./config/auth.ts";
import { toNodeHandler } from "better-auth/node";
import { swaggerDocs } from "./config/swagger.ts";
import { logger } from "./utils/logger.ts";

const app = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://esm.sh",
        ],
        connectSrc: ["'self'", "https://accounts.google.com", "https://esm.sh"], // Google Auth might require connecting to Google
        imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"], // Google profile images
      },
    },
  }),
);
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Auth Handler
app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());

// Routes
app.get("/status", (req, res) => {
  res.send({ message: "API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Swagger Docs
swaggerDocs(app, config.port);

// Error Handling (must be last)
app.use(errorHandler);

if (process.argv[1] === import.meta.filename) {
  app.listen(config.port, () => {
    logger.info(
      `Server is running on port ${config.port} in ${config.env} mode`,
    );
  });
}

export { app };
