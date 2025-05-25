const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API accessible at : http://localhost:` + PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database or start server:", err);
    process.exit(1);
  });
