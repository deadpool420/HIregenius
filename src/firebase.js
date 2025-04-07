import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut 
} from 'firebase/auth';
import { getDatabase, ref, set, push, remove, onValue, get } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHui_SSROync1w8VqxYoWjm-XBsgFSRRU",
  authDomain: "hiregenius-847dd.firebaseapp.com",
  databaseURL: "https://hiregenius-847dd-default-rtdb.firebaseio.com",
  projectId: "hiregenius-847dd",
  storageBucket: "hiregenius-847dd.appspot.com",
  messagingSenderId: "621306279526",
  appId: "1:621306279526:web:31d179d01d7ba745035fa7",
  measurementId: "G-LQ44L2L8MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Save User Data (Job Seeker or Job Poster)
const saveUserData = async (userId, email, userType, name) => {
  try {
    const userRef = ref(db, userType === "jobPoster" ? `jobPosters/${userId}` : `jobSeekers/${userId}`);
    await set(userRef, { userId, email, userType, name, createdAt: new Date().toISOString() });
    console.log("✅ User data saved successfully.");
  } catch (error) {
    console.error("❌ Error saving user data:", error.message);
  }
};

// ✅ Save Job Data (For Job Posters)
const saveJobData = async (jobDetails) => {
  try {
    const jobsRef = ref(db, 'jobs');  
    const newJobRef = push(jobsRef);  
    const jobId = newJobRef.key;

    const updatedJobDetails = {
      jobId,
      ...jobDetails,
      createdAt: new Date().toISOString(),
    };

    // Save globally under `/jobs`
    await set(newJobRef, updatedJobDetails);

    // Save under the job poster’s listing
    const userJobRef = ref(db, `jobPosters/${jobDetails.postedBy}/jobs/${jobId}`);
    await set(userJobRef, updatedJobDetails);

    console.log("✅ Job posted successfully!");
  } catch (error) {
    console.error("❌ Error saving job data:", error.message);
  }
};

// ✅ Delete Job Data
const deleteJobData = async (jobId, userId) => {
  try {
    await remove(ref(db, `jobs/${jobId}`));  
    await remove(ref(db, `jobPosters/${userId}/jobs/${jobId}`));  
    console.log("✅ Job deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting job:", error.message);
  }
};

// ✅ Fetch All Jobs with Poster Name
const fetchAllJobs = async (callback) => {
  try {
    const jobsRef = ref(db, 'jobs');
    onValue(jobsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const jobsData = snapshot.val();
        const jobList = Object.keys(jobsData).map(jobId => jobsData[jobId]);

        // Fetch poster names for each job in parallel using Promise.all
        const updatedJobList = await Promise.all(jobList.map(async (job) => {
          try {
            const posterRef = ref(db, `jobPosters/${job.postedBy}`);
            const posterSnapshot = await get(posterRef);
            job.posterName = posterSnapshot.exists() ? posterSnapshot.val().name || "Unknown" : "Unknown";
          } catch (posterError) {
            console.error("❌ Error fetching poster name:", posterError.message);
            job.posterName = "Unknown";
          }
          return job;
        }));

        console.log("✅ Fetched Jobs:", updatedJobList);
        callback(updatedJobList);
      } else {
        console.log("ℹ️ No jobs found in the database.");
        callback([]);
      }
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error.message);
    callback([]);
  }
};

// ✅ Fetch Single Job By ID
const fetchJobById = async (jobId, callback) => {
  try {
    const jobRef = ref(db, `jobs/${jobId}`);
    const snapshot = await get(jobRef);
    if (snapshot.exists()) {
      const jobData = snapshot.val();
      callback(jobData);
    } else {
      console.log("ℹ️ Job not found");
      callback(null);
    }
  } catch (error) {
    console.error("❌ Error fetching job by ID:", error.message);
    callback(null);
  }
};

// ✅ Apply for a Job (Job Seeker applies)
const applyForJob = async (jobId, jobSeekerId, callback) => {
  try {
    // Fetch job details
    const jobSnap = await get(ref(db, `jobs/${jobId}`));
    if (!jobSnap.exists()) throw new Error('Job not found');
    const job = jobSnap.val();

    // Fetch job seeker details
    const seekerSnap = await get(ref(db, `jobSeekers/${jobSeekerId}`));
    if (!seekerSnap.exists()) throw new Error('Job seeker not found');
    const seeker = seekerSnap.val();

    // Build application data with full details
    const applicationsRef = ref(db, 'applications');
    const newApplicationRef = push(applicationsRef);
    const applicationId = newApplicationRef.key;

    const applicationData = {
      applicationId,
      jobId,
      jobTitle: job.jobTitle || '',
      jobLocation: job.jobLocation || '',
      salary: job.salary || '',
      jobPosterId: job.postedBy || '',
      jobSeekerId,
      jobSeekerName: seeker.name || seeker.fullName || '',
      jobSeekerEmail: seeker.email || '',
      appliedAt: new Date().toISOString(),
      status: 'Pending',
    };

    // Save application data
    await set(newApplicationRef, applicationData);
    console.log("✅ Applied for job successfully with full details!");
    callback(true);
  } catch (error) {
    console.error("❌ Error applying for job:", error.message);
    callback(false);
  }
};

// ✅ Export functions
export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut, 
  db, 
  saveUserData, 
  saveJobData, 
  deleteJobData, 
  fetchAllJobs, 
  fetchJobById, 
  applyForJob 
};
