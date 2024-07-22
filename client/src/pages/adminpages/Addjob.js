import React, { useState } from 'react';
import AdminLayouts from '../../admincomponents/AdminLayouts';
import { useData } from '../../API/ApiContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const addJobValue = {
  company: '',
  position: '',
  status: '',
  jobType: '',
  jobLocation: '',
  jobAd: '',
};
const resumeUpload = {
   resume: null,
};

const Addjob = () => {
  const [addJob, setaddJob] = useState(addJobValue);
  const [addResume, setaddResume] = useState(resumeUpload);
  const navigate = useNavigate();
  const { addJobAPI } = useData();

  // const [formData, setFormData] = useState({
  //   resume: null,
  // });

  const getAddJobValue = (e) => {
    // const { name, value } = e.target;
    setaddJob({ ...addJob, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // const file = e.target.files[0];
    setaddResume({ ...addResume, resume: e.target.files[0] });
  };

  const isFormValid = () => {
    const { company, position, status, jobType, jobLocation } = addJob;
    if (!company || !position || !status || !jobType || !jobLocation) {
      return false;
    }
    return true;
  };

  const Submit_AddJob = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("All fields are required", {
        position: 'top-center',
      });
      return;
    }

    // const formData = new FormData();
    // for (const key in addJob) {
    //   formData.append(key, addJob[key]);
    // }
    // if (formData.resume) {
    //   data.append('resume', formData.resume);
    // }

    const res = await addJobAPI(addJob, addResume);
    if (res.success) {
      toast.success("Job Added Successfully", {
        position: "top-center",
      });
      setTimeout(() => {
        navigate('/alljob');
      }, 1000);
    } else {
      toast.error("Failed To Add Job", {
        position: "top-center",
      });
      console.log("Failed to Add Job", res.error);
    }
  };

  return (
    <AdminLayouts>
      <div className="bg-white rounded-lg shadow relative m-10">
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold">Add Job</h3>
        </div>
        <div className="p-6 space-y-6">
          <form method="post" enctype="multipart/form-data" onSubmit={Submit_AddJob}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="position" className="text-sm font-medium text-gray-900 block mb-2">Position</label>
                <input type="text" onChange={(e) => getAddJobValue(e)} name="position" id="position" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Position" required />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="company" className="text-sm font-medium text-gray-900 block mb-2">Company</label>
                <input type="text" onChange={(e) => getAddJobValue(e)} name="company" id="company" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Company" required />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="jobLocation" className="text-sm font-medium text-gray-900 block mb-2">Job Location</label>
                <input type="text" onChange={(e) => getAddJobValue(e)} name="jobLocation" id="jobLocation" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Job Location" required />
              </div>
              <div className="col-span-full">
                <label htmlFor="jobstatus" className="text-sm font-medium text-gray-900 block mb-2">Job Status</label>
                <select name='status' onChange={(e) => getAddJobValue(e)} id="jobstatus" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                  <option value="">Select Job Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Interview">Interview</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
              <div className="col-span-full">
                <label htmlFor="jobtype" className="text-sm font-medium text-gray-900 block mb-2">Job Type</label>
                <select name='jobType' onChange={(e) => getAddJobValue(e)} id="jobtype" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                  <option value="">Select Job Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="jobAd" className="text-sm font-medium text-gray-900 block mb-2">Job Posting</label>
                <input type="text" onChange={(e) => getAddJobValue(e)} name="jobAd" id="jobAd" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Job Ad URL" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="resume" className="text-sm font-medium text-gray-900 block mb-2">Upload CV/Resume</label>
                <input type="file" onChange={handleFileChange} name="resume" id="resume" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 rounded-b">
              <button onClick={Submit_AddJob} className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Add Job</button>
            </div>
          </form>
        </div>

        <ToastContainer />
      </div>
    </AdminLayouts>
  );
};

export default Addjob;
