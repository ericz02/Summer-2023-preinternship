import { useState } from "react";
import classNames from "classnames";
import JobCard from "./JobCard";
import jobsData from "./jobs";
import "./App.css";
import Modal from "./ui/Modal";

const statuses = {
  1: "Bookmarked",
  2: "Applying",
  3: "Applied",
  4: "Interviewing",
  5: "Negotiating",
  6: "Accepted",
};

function App() {
  const [jobs, setJobs] = useState(jobsData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(1);

  const filteredJobs = jobs.filter(job => job.status === selectedStatus)

  const jobCards = filteredJobs.map((job, i) => {
    return <JobCard job={job} key={i} />;
  });

  const statusButtons = Object.keys(statuses).map(statusId => {
    const buttonClass = classNames(
      "px-4 py-2 border",
      {
        "bg-blue-500": selectedStatus === parseInt(statusId)
      }
    )
    return (
      <button
        key={statusId}
        className={buttonClass}
        onClick={() => setSelectedStatus(parseInt(statusId))}
      >
        {statuses[statusId]}
      </button>
    );
  })

  const showModal = () => {
    setIsModalVisible(true);
  }

  const hideModal = () => {
    setIsModalVisible(false);
  }

  const handleAddJobFormSubmit = (e) => {
    e.preventDefault();
  }
  
  return (
    <div className="mx-auto max-w-4xl">
      <h1>Job Application Tracker</h1>
      <div className="grid grid-cols-6 my-4">{statusButtons}</div>
      <div className="flex justify-between">
        <div></div>
        <div>
          <button
            className="bg-blue-500 px-4 py-2 hover:bg-blue-600 transition"
            onClick={showModal}
          >
            + Add Job
          </button>
        </div>
      </div>

      {jobCards}
      <Modal
        isVisible={isModalVisible}
        hideModal={hideModal}
      >
        <form onSubmit={handleAddJobFormSubmit} className="selection:bg-blue-200 flex flex-col gap-2">
          <h1>Add Job Posting</h1>
          <fieldset className="flex flex-col">
            <label htmlFor="title">Job Title</label>
            <input 
              type="text" 
              name="title" 
              id="title"
              className="bg-white border-4 focus:outline-none"
            />
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="company">Company</label>
            <input 
              type="text" 
              name="company" 
              id="company"
              className="bg-white border-4 focus:outline-none"
            />
          </fieldset>
        </form>
      </Modal>
    </div>  
  );
}

export default App;