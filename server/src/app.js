import express from "express";
import userRoutes from "./routers/users.routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
}));

app.use("/api/users", userRoutes);

export default app;
