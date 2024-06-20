import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import { register } from "./controllers/auth.js";
import User from "./models/User.model.js";
import Post from "./models/Post.model.js";
import { users, posts } from "./data/index.js";

const { urlencoded } = pkg;

// CONFIGURATION - Configuring middle wares

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy);
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FILE STORAGE - Configuring file storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination of file
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    // setting name of the uploaded file
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // we use this variable everytime we upload file

// ROUTES WITH FILES

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES - helps us create routes and keep our files organized

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP

const PORT = process.env.PORT || 6001;
mongoose
  .connect(
    process.env.MONGO_URL
    //   {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // adding data one time
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`Database connection error: ${error}`));
