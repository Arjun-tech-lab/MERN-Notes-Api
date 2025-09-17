import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middlewear/ratelimiter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "https:"],
  imgSrc: ["'self'", "data:", "https:"],
  connectSrc: ["'self'"], // base rule
};

if (process.env.NODE_ENV !== "production") {
 
  cspDirectives.connectSrc.push("http://localhost:5173");
} else {

  cspDirectives.connectSrc.push("https://your-production-frontend.com");
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: cspDirectives,
    },
  })
);

// Middleware to parse JSON request bodies
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(express.json());
app.use(rateLimiter);

// Mount routes
app.use("/api/notes", notesRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(5001, () => {
    console.log("server started on port :5001");
  });
});
