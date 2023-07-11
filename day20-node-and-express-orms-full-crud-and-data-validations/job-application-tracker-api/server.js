const express = require("express");
const app = express();
const port = 4000;
require("dotenv").config();

const { query } = require("./database");
const { JobApplication } = require("./models");

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});
app.use(express.json());

function getNextIdFromCollection(collection) {
  if (collection.length === 0) return 1;
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Job App Tracker API!!!!");
});

// Get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const allJobs = await JobApplication.findAll();

    res.status(200).json(allJobs);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Get a specific job
app.get("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const job = await JobApplication.findOne({ where: { id: jobId } });

    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Create a new job
app.post("/jobs", async (req, res) => {
  const jobData = req.body;
  try {
    const newJob = await JobApplication.create(jobData);
    res.status(201).json(newJob);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map(e => e.message) });
    }
    console.error(err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

// Update a specific job
app.patch("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const [numberOfAffectedRows, affectedRows] = await JobApplication.update(req.body, { where: { id: jobId }, returning: true });

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.error(err);
  }
});

// Delete a specific job
app.delete("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const deleteOp = await query("DELETE FROM job_applications WHERE id = $1", [
      jobId,
    ]);

    if (deleteOp.rowCount > 0) {
      res.status(200).send({ message: "Job deleted successfully" });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
