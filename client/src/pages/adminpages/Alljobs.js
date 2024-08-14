import React, { useEffect, useState } from 'react'
import AdminLayouts from '../../admincomponents/AdminLayouts'
import { useData } from '../../API/ApiContext'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const Alljobs = () => {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [numOfPages, setNumOfPages] = useState(1);
  const [status, setStatus] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { getAllJobsAPI, deleteJobAPI } = useData();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };
  //page handle
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= numOfPages) {
      setPage(newPage);
    }
  };
  //
  const handleSubmit = async (e) => {
    setLoading(true)
    const queryParams = new URLSearchParams({
      status,
      jobType,
      sort,
      search,
      page,
      limit
    })
    setTimeout(async () => {
      const res = await getAllJobsAPI(queryParams)
      if (res.success) {
        const { data } = res;
        console.log(data)
        setJobs(data.data.jobs)
        setTotalJobs(data.data.totalJobs)
        setNumOfPages(data.data.numOfPages)
      } else {
        console.error(res.message || res.error);
      }
      setLoading(false)
    }, 1500)
  }

  // Delete Job
  const deleteJob = async (id) => {
    const res = await deleteJobAPI(id)
    if (res.success) {
      setTimeout(() => {
        toast.success("Job Deleted Successfully!", {
          position: "top-center"
        })
      }, 2000);
      handleSubmit()
    } else {
      console.error(res.message || res.error);
    }
  }
  useEffect(() => {
    handleSubmit()
  }, [status, jobType, sort, search, page, limit])

  return (
    <AdminLayouts>
      <section>
        <div className="bg-white rounded-lg shadow relative m-10">
          <div className="flex items-start justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold">
              Search Job
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <form action="#" method='POST' onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Search" className="text-sm font-medium text-gray-900 block mb-2">Search</label>
                  <input type="text" onChange={handleSearchChange} value={search} name="Search" id="Search" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Search" required="" />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="jobstatus" className="text-sm font-medium text-gray-900 block mb-2">Job Status</label>
                  <select name='jobstatus' onChange={handleStatusChange} value={status} id="jobstatus" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                    <option value='all'>All</option>
                    <option value='Pending'>Pending</option>
                    <option value='Interview'>Interview</option>
                    <option value='Declined'>Declined</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="JobType" className="text-sm font-medium text-gray-900 block mb-2">Job Type</label>
                  <select name='jobtype' value={jobType} id="JobType" onChange={handleJobTypeChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                    <option value='all'>All</option>
                    <option value='Full Time'>Full Time</option>
                    <option value='Part Time'>Part Time</option>
                    <option value='Contract'>Contract</option>
                    <option value='Internship'>Internship</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Sort" className="text-sm font-medium text-gray-900 block mb-2">Sort</label>
                  <select name='Sort' value={sort} onChange={handleSortChange} id="Sort" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="a-z">A-Z</option>
                    <option value="z-a">Z-A</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="p-6 border-t border-gray-200 rounded-b">
            <button onClick={() => {
              setSearch('');
              setStatus('all');
              setJobType('all');
              setSort('latest');
              setPage(1);
            }} className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Reset Search Value</button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
            </div>
          </div>
        </div>
      ) : (
        <div className='overflow-x-auto bg-white rounded-lg shadow relative m-10 flex justify-between'>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Posting</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV/Resume</th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job, index) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.jobLocation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(job.createdAt).toDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.jobType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.status}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {job.jobAd.length > 30 ? (
                      <>
                        <a href={job.jobAd} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {`${job.jobAd.substring(0, 30)}...`}</a>
                      </>
                    ) : (
                      <a href={job.jobAd} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {job.jobAd}</a>
                    )}</td>

                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {job.resume && (
                      <>
                        {job.resume.length > 30 ? (
                          <a href={job.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            {`${job.resume.substring(0, 30)}...`}
                          </a>
                        ) : (
                          <a href={job.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            {job.resume}
                          </a>
                        )}
                      </>
                    )}
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      <Link to={"https://storage.googleapis.com/" + job.resume} className="text-cyan-600 hover:text-cyan-900 mr-2" target="_blank">View</Link>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      <Link to={"/editjob/" + job._id} className="text-cyan-600 hover:text-cyan-900 mr-2">
                      <i class='fa fa-edit'></i></Link>
                      <button onClick={() => deleteJob(job._id)} className="text-cyan-600 hover:text-cyan-900">
                      <i class='fa fa-trash-o'></i></button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='border-t border-gray-100 pt-4 flex items-center justify-center'>
        <button className='p-1 mr-4 rounded border text-black bg-white hover:text-white hover:bg-blue-600 hover:border-blue-600' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>
        </button>

        <span>Page {page} of {numOfPages}</span>
        <button className='p-1 ml-4  rounded border text-black bg-white hover:text-white hover:bg-blue-600 hover:border-blue-600' onClick={() => handlePageChange(page + 1)} disabled={page >= numOfPages}>
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>
      <ToastContainer />
    </AdminLayouts>
  )
}

export default Alljobs