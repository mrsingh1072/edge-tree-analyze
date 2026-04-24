const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const bfhlRoutes = require("./routes/bfhlRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", service: "EdgeTree Analyzer API" });
});

app.use("/", bfhlRoutes);

app.use((err, _req, res, _next) => {
  const status = Number(err?.status) || 500;
  res.status(status).json({
    error: err?.message || "Internal Server Error",
  });
});

const port = Number(process.env.PORT) || 5000;
if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`EdgeTree Analyzer backend running on port ${port}`);
  });
}

module.exports = app;

