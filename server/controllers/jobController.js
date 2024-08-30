const { default: mongoose } = require('mongoose');
const Job = require('../models/jobModel');
const moment = require('moment');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config({path:'./.env'})

const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
);
 
const storage = new Storage({
  project_id: process.env.GOOGLE_PROJECT_ID,

  credentials: {
    type: credential.type,
    private_key_id: credential.private_key_id,
    private_key: credential.private_key,
    client_email: credential.client_email,
    client_id: credential.client_id,
    auth_uri: credential.auth_uri,
    token_uri: credential.token_uri,
    auth_provider_x509_cert_url: credential.auth_provider_x509_cert_url,
    client_x509_cert_url: credential.client_x509_cert_url,
    universe_domain: credential.universe_domain
  }
});

// Create a bucket instance
const bucketName = 'jobstruct-web-app';
const bucket = storage.bucket(bucketName);

// create job 
const createJob = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    const { company, position, status, jobLocation, jobType, jobAd } = req.body;
    // const resumePath = req.file ? req.file.filename : null;

    if (!company || !position) {
      res.status(404).json({
        status: "failed",
        message: "Please provide complete details"
      });
      return;
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    resume = req.file;
    const fileName = Date.now() + resume.originalname;
    const blob = bucket.file(fileName);

    console.log("Resume:", fileName);

    // Create write stream for uploading file
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: resume.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).json({ error: 'Unable to upload file, please try again later' });
    });

    blobStream.on('finish', async () => {
      try {
        // Create job object with all data
        const job = await Job.create({
          company,
          position,
          status,
          jobLocation,
          jobType,
          jobAd,
          resume: bucketName + '/' + fileName,
          createdBy: req.user._id,
        });

        res.status(201).json({
          status: "Success",
          message: "Job Created Successfully",
          data: job
        });
        console.log("Job Created:", job);
      } catch (err) {
        res.status(500).json({
          status: "failed",
          message: "Unable to create job after file upload",
          error: err.message
        });
      }
    });

    blobStream.end(resume.buffer);

  } catch (error) {
    console.log("Error:", error)
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

    // const [resumes] = await bucket.getFiles();
    // res.render('index', { resumes });
    // const [files] = await bucket.getFiles();
    // const fileList = files.map(file => ({
    //   name: file.name,
    //   url: `https://storage.googleapis.com/${bucketName}/${file.name}`
    // }));

    // console.log("File List:", fileList);

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

    // Pagination
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      message: "Jobs retrieved successfully",
      // fileList,
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
      error: error.message
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

// delete a job
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

    // const filename = req.body.fileName;
    // if (!filename) {
    //   res.status(400).json("File name not found")
    //   return;
    // }

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

    // delete resume on google cloud storage
    let resume = job.resume;
    console.log(resume);
    let newName = resume.replace(bucketName + '/', '');
    console.log(newName);

    await bucket.file(newName).delete();

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'Failed',
      message: 'An error occurred while deleting the job'
    });
  }
};

//Show job status 
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