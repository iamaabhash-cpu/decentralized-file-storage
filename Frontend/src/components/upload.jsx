import { useState } from "react";
import { getContract } from "../blockchain";

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

      // Upload to backend
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Upload failed.");
        return;
      }

      // Store CID on blockchain
      const contract = await getContract();

      const tx = await contract.uploadFile(
        data.cid,
        file.name
      );

      await tx.wait();

      setResult(data);

      alert("File uploaded successfully!");

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

      <div className="upload-row">

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

      </div>

      {file && (
        <p className="selected-file">
          <strong>Selected File:</strong> {file.name}
        </p>
      )}

      {result && (
        <div className="result-box">

          <h3>✅ Upload Successful</h3>

          <p>
            <strong>File Name</strong>
            <br />
            {file.name}
          </p>

          <p>
            <strong>IPFS CID</strong>
            <br />
            {result.cid}
          </p>

          <p>
            <strong>Gateway URL</strong>
          </p>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.url}
          </a>

        </div>
      )}

    </div>
  );
}

export default Upload;