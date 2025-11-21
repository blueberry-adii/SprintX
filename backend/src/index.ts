import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Backend Server running");
});

app.listen(5000, () => {
  console.log("Server on http://localhost:5000");
});
