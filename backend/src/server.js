import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middlewear/ratelimiter.js";
import cors from "cors"

dotenv.config();

const app = express();





// middleware to parse JSON request bodies
app.use(cors({
  origin:"http://localhost:5173",
}));
app.use(express.json());
app.use(rateLimiter);




// mount routes
app.use("/api/notes", notesRoutes);

connectDB().then(()=>{
  app.listen(5001, () => {
  console.log("server started on port :5001");
});

})



