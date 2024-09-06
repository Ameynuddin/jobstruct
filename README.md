# Job Tracker Web App
Disclaimer: This project is still under development. Some features mentioned herein are yet to be accessible or available.

## Overview

The Job Tracker Web App is designed to help job seekers efficiently manage and track their job applications. It allows users to customize tracking fields, integrate with Google Calendar for reminders, store resumes securely on Google Cloud, and receive notifications via in-app or email. The app is built using the MERN stack and provides a user-friendly interface for both desktop and mobile devices.

## Features

- **Customizable Tracking Fields**: Tailor the app to your specific needs by adding custom fields such as job posting URLs, tailored resumes, and follow-up reminders.
- **Google Calendar Integration**: Set reminders for important dates like application deadlines, interview schedules, and follow-up tasks.
- **Advanced Sorting and Filtering**: Organize applications by status, job type, company name, or date.
- **Secure Resume Storage**: Upload, store, and access resumes securely on Google Cloud.
- **Personalized Notifications**: Receive timely alerts via app or email for upcoming interviews, deadlines, and tasks.
- **Data Analytics**: Track application success rates and gain insights to improve your job search strategy.
- **Cross-Platform Accessibility**: Access the app from various devices and operating systems.
- **Collaboration Features**: Share your job tracking progress with mentors or career coaches for feedback and support.

## Technology Stack

- **Frontend**: React.js, HTML, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Cloud Storage**: Google Cloud
- **Notifications**: Twilio API
- **Calendar Integration**: Google Calendar API

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB installed or access to a MongoDB cloud instance
- Google Cloud account for storing resumes
- Twilio account for sending notifications

### Steps

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/job-tracker-web-app.git
    cd job-tracker-web-app
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=8080
    DBURL=your_mongodb_url
    JWT_SECRET=your_jwt_secret_key
    GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
    GOOGLE_CLOUD_KEYFILE_PATH=path_to_your_google_cloud_keyfile.json
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REFRESH_TOKEN=your_google_refresh_token
    ```

4. **Run the application:**

    ```sh
    npm start
    ```

5. **Access the app:**

    Open your browser and navigate to `http://localhost:8080`.

## Usage/Screen

1. **Homepage:**
   Homepage comes with light and dark mode toggle and the option to register or log in.

   ![homepage](client/public/output/homepage.png)
   
   ![dark_mode](client/public/output/dark_mode.png)
   
2. **Sign Up / Log In:**
   Create a new account or log in with your existing credentials.

   ![register](client/public/output/register.png)
   
   ![sign_in](client/public/output/sign_in.png)
   
3. **Dashboard:**
   The dashboard presents the statistics of total jobs applied and applications pending, declined and scheduled for interview.
   
   ![dashboard](client/public/output/dashboard.png)
   
4. **Add Job Applications:**
   Input your job applications manually, customizing the fields as needed.

    ![add_job](client/public/output/add_job.png)

5. **Upload Resumes:**
   Upload and store your resumes securely on Google Cloud storage using bucket.

6. **Track Progress:**
   Use advanced sorting and filtering options to manage your applications.
    ![all_jobs](client/public/output/all_jobs.png)

7. **User Profile:**
   Manage user information, such as, avatar, name and email.
   ![profile](client/public/output/profile.png)
   
8. **Set Reminders:** (pending feature)
   Integrate with Google Calendar to set reminders for important dates.

9. **Receive Notifications:** (pending feature)
   Enable SMS or email notifications for reminders and updates.

## Contributing

We welcome contributions to enhance the Job Tracker Web App. To contribute, please fork the repository, create a new branch for your feature or bugfix, and submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact me at md.ameynuddin@gmail.com.

---

Feel free to adjust the content to match the specifics of your project and personal preferences.
