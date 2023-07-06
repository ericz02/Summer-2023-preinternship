const express = require("express")
const app = express();
const port = 4000;
const jobs = require("./jobs")
const axios = require("axios")
require("dotenv").config();

app.use((req, res, next) => {
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

app.use(express.json())

app.get("/recipes", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = "https://api.spoonacular.com/recipes/complexSearch";

    const { data } = await axios.get(url, {
      params: {
        ...req.query,
        apiKey: apiKey
      }
    })

  } catch (error) {
    console.log(error)
    res.status(500).send("An error occurred.")
  }
})

function getNextIdFromCollection(collection) {
  if(collection.length === 0) return 1; 
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

// get all the jobs
app.get("/jobs", (req, res) => {
  res.send(jobs)
})

// get a specific job
app.get("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const job = jobs.find(j => j.id === jobId)
  if (job) {
    res.send(job)
  } else {
    res.status(404).send({ message: "Job not found" });
  }
})

// create a job
app.post("/jobs", (req, res) =>  {
  const newJob = {
    ...req.body,
    id: getNextIdFromCollection(jobs)
  }
  jobs.push(newJob);
  console.log("newJob", newJob)
  res.status(201).send(newJob)
})

// update a job
app.patch("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const jobUpdates = req.body;
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  const updatedJob = { ...jobs[jobIndex], ...jobUpdates };
  jobs[jobIndex] = updatedJob;
  // console.log("updatedJob", updatedJob);
  res.send(updatedJob);
});

// delete a specific job
app.delete("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  jobs.splice(jobIndex, 1);
  res.send({ message: "Job deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})