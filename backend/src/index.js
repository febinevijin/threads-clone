import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";

import connectDB from "./config/connectDb.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

connectDB();
const app = express();
const whitelist = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.set("trust proxy", 1); // trust first proxy

const corsOptions = {
 
  origin(origin, callback) {
    if (!origin) {
      // for mobile app and postman client
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("tiny"));
app.get("/check", async (req, res) => {
  return res.status(200).send("server live!");
});




app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
