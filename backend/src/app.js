
const express = require("express");
const cors = require("cors");

const indexRoutes = require("./routes/index.routes");
const workOrderRoutes = require("./routes/workorders.routes");
const requestIdMiddleware = require("./middleware/requestId.middleware");
const notFoundMiddleware = require("./middleware/notfound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);


app.options("*", cors());


app.use(express.json());
app.use(requestIdMiddleware);

// Optional request logging
app.use((req, _res, next) => {
  console.log(`[${req.requestId}] ${req.method} ${req.originalUrl}`);
  next();
});


app.use("/", indexRoutes);
app.use("/api/workorders", workOrderRoutes);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;