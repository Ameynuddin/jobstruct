const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/multerMiddleware')
const { createJob,
    getAllJobs,
    updateJob,
    deleteJob,
    getJob,
    ShowStatus } = require("../controllers/jobController")

router.route('/')
    .get(protect, getAllJobs)
    .post(protect, upload.single('resume'), createJob);

router.route('/stats').get(protect, ShowStatus)
router.route('/:id').get(protect, getJob).patch(protect, updateJob).delete(protect, deleteJob)

module.exports = router