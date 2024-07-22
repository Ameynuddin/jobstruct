const { default: mongoose } = require('mongoose');
const Job = require('../models/jobModel');
const moment = require('moment');

// create job 
const createJob = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    const { company, position, status, jobLocation, jobType, jobAd } = req.body;
    const resumePath = req.file ? req.file.filename : null;
    console.log("Resume:", resumePath);

    if (!company || !position) {
      res.status(404).json({
        status: "failed",
        message: "Please provide complete details"
      });
      return;
    }

    // Create job object with all data
    const job = await Job.create({
      company,
      position,
      status,
      jobLocation,
      jobType,
      jobAd,
      resume: resumePath,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "Success",
      message: "Job Created Successfully",
      data: job 
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: "failed",
      message: "API did not work",
      error: error.message
    });
  }
};

// get all jobs
const getAllJobs = async (req, res) => {
  try {
    const { status, jobType, sort, search, page = 1, limit = 10 } = req.query;
    const queryObject = { createdBy: req.user._id };

    if (status && status !== 'all') {
      queryObject.status = status;
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType;
    }
    if (search) {
      queryObject.position = { $regex: search, $options: 'i' };
    }

    let result = Job.find(queryObject);


    if (sort) {
      const sortOptions = {
        latest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position',
      };
      result = result.sort(sortOptions[sort]);
    }

    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      message: "this is very good",
      data: {
        jobs,
        totalJobs,
        numOfPages
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

//Update job
const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { company, position } = req.body;
    if (!company || !position) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide all values"
      })
    }

    // Find the job and check permissions in one go
    const job = await Job.findOne({ _id: jobId })
    if (!job) {
      return res.status(404).json({
        status: "Failed",
        message: "No jobs found"
      })
    }
    // console.log('CreateBy',job.createdBy.toString())
    // console.log('CreateBy',req.user._id.toString())

    // Check if the user has permission to update the job
    if (req.user._id.toString() !== job.createdBy.toString()) {
      res.status(404).json({
        status: "Failed",
        message: "Not authorized to make changes"
      });
    }

    const updatedJob = await Job.findByIdAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { updatedJob }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

//getjobs 
const getJob = async (req, res) => {
  try {
    const { id: jobID } = req.params;
    const job = await Job.findOne({ _id: jobID });

    if (!job) {
      return res.status(404).json({
        status: "Failed",
        message: "No job data found"
      });
    }

    if (req.user._id.toString() !== job.createdBy.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Not authorized to view this job"
      });
    }

    res.status(200).json({
      status: 'success',
      data: { job }
    });

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "An error occurred while retrieving the job"
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      return res.status(404).json({
        status: "Failed",
        message: "No job data found"
      });
    }

    if (req.user._id.toString() !== job.createdBy.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Not authorized to delete this job"
      });
    }

    await Job.deleteOne({ _id: jobId });
    res.status(200).json({
      status: 'Success',
      message: 'Job removed successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'Failed',
      message: 'An error occurred while deleting the job'
    });
  }
};

//Show jon status 
const ShowStatus = async (req, res) => {
  try {
    // Convert user ID to a Mongoose ObjectId
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user._id.toString());

    // Perform the aggregation for status counts
    let state = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Prepare default status counts
    const defaultStats = {
      Pending: 0,
      Interview: 0,
      Declined: 0,
      ...state.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {})
    };

    // Perform the aggregation for monthly applications
    let monthlyApplications = await Job.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Format monthly applications data
    monthlyApplications = monthlyApplications
      .map(({ _id: { year, month }, count }) => ({
        date: moment().month(month - 1).year(year).format('MMM Y'),
        count
      }))
      .reverse();

    // Send response with success status and data
    res.status(200).json({
      status: "success",
      data: {
        defaultStats,
        monthlyApplications
      }
    });

  } catch (error) {
    console.error('Error in ShowStatus:', error); // Log detailed error message
    res.status(500).json({
      status: 'Failed',
      message: 'An error occurred'
    });
  }
};


module.exports = {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getJob,
  ShowStatus
}