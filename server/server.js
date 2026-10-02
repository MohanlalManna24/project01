import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

if (!process.env.PORT) {
  console.error("PORT is not defined in the environment variables.");
  process.exit(1);
}
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
