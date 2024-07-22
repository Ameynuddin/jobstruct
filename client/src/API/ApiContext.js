import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'  // function to decode JSON Web Tokens (JWTs)

const ApiContext = createContext();
const token = localStorage.getItem('token') //  Retrieving a token from localStorage if it exists

export const ApiProvider = ({ children }) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const JWT_TOKEN_KEY = process.env.REACT_APP_JWT_TOKEN_KEY;

    //Auth Check State
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token')
    })
    // Ensures that isAuthenticated is updated whenever the component mounts
    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('token'));
    }, []);

    // 1) User Register Api
    const RegisterApi = async (register) => {
        const { name, email, password, passwordConfirm } = register;
        try {
            const res = await fetch(`${API_URL}/api/v1/user/signup`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, passwordConfirm }) // JS object shorthand notation if key & value are the same
            });
            const res_data = await res.json();
            console.log(res_data)
            if (res.ok) {
                const { token } = res_data;
                console.log('Received token:', token);
                localStorage.setItem('token', token);
                // Show success message and redirect or any other logic
                return { success: true, token };
            } else {
                console.error('Signup failed:', res_data.error);
                return { success: false, error: res_data.error };
            }
        } catch (eror) {
            console.error('Error:', eror);
            return { success: false, error: eror.message };
        }
    };

    // 2) Login Api
    const LoginApi = async (login) => {
        const { email, password } = login;
        try {
            const res = await fetch(`${API_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN_KEY}`, // for authentication
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            const res_data = await res.json();
            if (res.ok) {
                const { token } = res_data;
                setIsAuthenticated(true)
                localStorage.setItem('token', token);
                console.log('Login successful!')
                return { success: true };
            } else {
                console.log('Login failed!', res_data.error)
                return { success: false, error: res_data.error };
            }
        } catch (error) {
            console.error('Error', error)
            return { message: false, error: error.message }
        }
    }

    //3) Logout Api
    const LogoutAPI = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/user/logout`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.ok) {
                setIsAuthenticated(false)
                localStorage.removeItem('token')
                console.log('Logout successful!')
                return { success: true };
            } else {
                console.error('Logout failed!:', res);
                return { success: false, message: 'Failed to logout' };
            }
        } catch (error) {
            console.error("Error:", error);
            return { success: false, error: error.message };
        }
    }

    //4)  add Job API
    const addJobAPI = async (addJob, addResume) => {
        // const token = localStorage.getItem('token');

        if (!token) {
            console.log("Token not found");
            return { success: false, error: "Token not found" };
        }

        let user;
        try {
            const decode = jwtDecode(token);
            user = decode.id;
        } catch (err) {
            console.log("Invalid token");
            return { success: false, error: "Invalid token" };
        }
        if (!user) {
            console.log("User is invalid");
            return { success: false, error: "User is invalid" };
        }

        try {
            const { company, position, status, jobType, jobLocation, jobAd } = addJob;
            const { resume } = addResume;

            const formData = new FormData();
            formData.append('company', company);
            formData.append('position', position);
            formData.append('status', status);
            formData.append('jobType', jobType);
            formData.append('jobLocation', jobLocation);
            formData.append('jobAd', jobAd);
            // formData.append('resume', resume);
            formData.append('createdBy', user);

            if (resume) {
                formData.append('resume', resume);
            }

            const res = await fetch(`${API_URL}/api/v1/jobs`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'application/json' // Added Content-Type header
                },
                // body: JSON.stringify({
                //     company: company,
                //     position: position,
                //     status: status,
                //     jobType: jobType,
                //     jobLocation: jobLocation,
                //     jobAd: jobAd,
                //     resume: resume,
                //     createdBy: user
                body: formData
                // }) // w/o object shorthand notation
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Job added successfully");
                return { success: true, message: "Job added successfully" };
            } else {
                console.log("Failed to add job", data.error);
                return { success: false, error: data.error || "Failed to add job" };
            }
        } catch (error) {
            console.log("Error", error);
            return { success: false, error: error.message || "An error occurred" };
        }
    }

    //5) get all Jobs
    const getAllJobsAPI = async (queryParams) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/jobs?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (res.ok) {
                const res_data = await res.json();
                console.log("All jobs fetched", res_data);
                return { success: true, data: res_data };
            } else {
                console.error("Jobs are not fetched", res.statusText);
                return { success: false, message: "failed to fetch jobs", status: res.status };
            }
        } catch (error) {
            console.error("Error fetching jobs", error)
            return { success: false, error: error.message || "An Error Occurred" }
        }
    }

    //6) Edit Job API
    const editJobAPI = async (id, editJob) => {
        const { company, position, status, jobType, jobLocation, jobAd } = editJob;
        try {
            const res = await fetch(`${API_URL}/api/v1/jobs/${id}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ company, position, status, jobType, jobLocation, jobAd })
            })
            if (res.ok) {
                const res_data = await res.json();
                return { success: true, data: res_data }

            } else {
                return { success: false, message: "Failed to edit" }
            }
        } catch (error) {
            return { success: false, error }
        }
    }
    //7) get one job API
    const getOneJobAPI = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/jobs/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (res.ok) {
                const res_data = await res.json();
                console.log("jobs get")
                return { success: true, data: res_data };
            } else {
                console.error("Jobs are not get")
                return { success: false, message: "failed to get jobs" }
            }
        } catch (eror) {
            console.error("Error", eror)
            return { success: false, error: eror.message || "An Error Occurred" }
        }
    }

    //8)Show State API
    const StateJobAPI = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/jobs/stats`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (res.ok) {
                const res_data = await res.json();
                return { success: true, message: "Job state success", data: res_data }
            } else {
                console.error("Error")
                return { success: false, message: "Failed to state" }
            }
        } catch (error) {
            console.error("Error", error)
            return { success: false, error: error.message || "An error occurred" }
        }
    }

    //9) Delete Job
    const deleteJobAPI = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/jobs/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                return { success: true, message: "Job are Delete" }
            } else {
                console.error("Jobs Are Delete")
                return { success: false, message: "Failed To Delete a job" }
            }


        } catch (error) {
            console.error("Error", error)
            return { success: false, error: error.message || "An Error Is Accoured" }
        }
    }

    const CurrentUser = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/user/currentUser`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const res_data = await res.json()
            if (res.ok) {
                return { success: true, message: "User get Sucessfully", data: res_data }
            } else {
                console.error("Error")
                return { success: false, message: "Failed Get Current User" }
            }
        } catch (error) {
            console.error("Error", error)
            return { success: false, error: error.message || "An Error Is Accoured" }
        }
    }

    const updateUser = async (updateValue, Profile) => {
        try {
            const { name, email } = updateValue;
            const { avatar } = Profile;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            if (avatar) {
                formData.append('avatar', avatar);
            }
            console.log(avatar)

            const res = await fetch(`${API_URL}/api/v1/user/updateUser`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    //'Content-Type': 'application/json'
                },
                body: formData
            });
            console.log(res)

            const res_data = await res.json();
            if (res.ok) {
                return {
                    success: true,
                    message: "User updated successfully",
                    data: res_data
                };
            } else {
                console.log("Error updating user", res_data.error);
                return { success: false, error: res_data.error || "Failed to update user" };
            }
        } catch (error) {
            console.log("Error", error);
            return { success: false, error: error.message || "An error occurred" };

        }
    }

    return (
        <ApiContext.Provider value={{
            isAuthenticated, RegisterApi, LoginApi, LogoutAPI, addJobAPI,
            getAllJobsAPI, deleteJobAPI, editJobAPI, getOneJobAPI, StateJobAPI, CurrentUser, updateUser
        }}>
            {children}
        </ApiContext.Provider>
    )
}

export const useData = () => {
    const context = useContext(ApiContext)
    if (!context) {
        throw new Error("useData must be used within a API Provider")
    }
    return context;
};