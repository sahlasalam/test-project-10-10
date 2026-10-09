const express = require("express");
const cors = require("cors");
const dbConnection = require("./middlewares/dbConnections");

const app = express();

const PORT = 4000;

const user = require("./routes/users");

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Node server is running!",
  });
});

app.use("/user", user);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

async () => {
  await dbConnection();
};
