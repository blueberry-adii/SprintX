import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Backend Server running");
});

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});
