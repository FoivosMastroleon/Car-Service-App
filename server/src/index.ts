import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import  authRoutes  from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import vehicleRoutes from "./routes/vehicle.routes";
import maintenanceTypeRoutes from "./routes/maintenanceType.routes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/maintenance-types", maintenanceTypeRoutes);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
