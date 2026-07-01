import { useState } from "react";
import { getContract } from "./blockchain";

function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      // Upload file to backend (IPFS)
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Upload failed.");
        return;
      }

      // Connect to smart contract
      const contract = await getContract();

      // Store CID on blockchain
      const tx = await contract.uploadFile(
        data.cid,
        file.name
      );

      // Wait for transaction confirmation
      await tx.wait();

      alert("File uploaded successfully and stored on the blockchain!");

      setResult(data);

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Successful!</h3>

          <p>
            <strong>File Name:</strong>
            <br />
            {file.name}
          </p>

          <p>
            <strong>IPFS CID:</strong>
            <br />
            {result.cid}
          </p>

          <p>
            <strong>Gateway URL:</strong>
          </p>

          <a
            href={result.url}
            target="_blank"
            rel="noreferrer"
          >
            View File on IPFS
          </a>
        </div>
      )}
    </div>
  );
}

export default Upload;