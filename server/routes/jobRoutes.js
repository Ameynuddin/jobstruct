const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const multer = require('multer')
// const upload = require('../middleware/multerMiddleware')
const { createJob,
    getAllJobs,
    updateJob,
    deleteJob,
    getJob,
    ShowStatus } = require("../controllers/jobController")

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
});

router.route('/')
    .get(protect, getAllJobs)
    // .post(protect, upload.single('resume'), createJob);
    .post(protect, upload.single('resume'), createJob);

router.route('/stats').get(protect, ShowStatus)
router.route('/:id').get(protect, getJob).patch(protect, updateJob).delete(protect, deleteJob)

module.exports = router;