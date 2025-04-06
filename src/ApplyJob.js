import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { auth } from "../firebaseConfig"; // Ensure user is authenticated

const ApplyJob = () => {
  const { jobId } = useParams();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadResume = async () => {
    if (!file || !auth.currentUser) {
      alert("Please select a file and log in.");
      return;
    }

    const userId = auth.currentUser.uid;
    const storage = getStorage();
    const storageRef = ref(storage, `resumes/${userId}/${jobId}/${file.name}`);

    setUploading(true);
    try {
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const db = getDatabase();
      const resumeRef = dbRef(db, `resumes/${jobId}/${userId}`);
      await set(resumeRef, {
        resumeURL: fileURL,
        uploadedAt: new Date().toISOString(),
      });

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading resume.");
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>Apply for Job</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadResume} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ApplyJob;
