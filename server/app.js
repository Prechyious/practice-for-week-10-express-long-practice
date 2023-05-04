require("express-async-errors");
const express = require('express');
const dogRouter = require("./routes/dogs");

const app = express();


// Serve all the files in the assets folder under the static resource.
app.use("/static", express.static("assets"));

// Parsing requests to JSON
app.use(express.json());


// Middleware to log method and URL path
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.path}`);
    console.log(res.statusCode);
  });
  next();
});

// Dogs router
app.use(dogRouter);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

// Resource Not Found
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  throw err;
});

// Production / development error handling
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({
      Error: {
        stack: process.env.NODE_ENV !== "production" ? err.stack : null
    }
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server is listening on port', port));
