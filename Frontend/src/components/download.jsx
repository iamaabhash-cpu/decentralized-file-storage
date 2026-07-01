import { useState } from "react";

function Download() {
  const [cid, setCid] = useState("");

  const handleDownload = () => {
    if (!cid.trim()) {
      alert("Enter a CID.");
      return;
    }

    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

    window.open(url, "_blank");
  };

  return (
    <div className="card">
      <h2>Download File</h2>

      <input
        type="text"
        placeholder="Enter CID..."
        value={cid}
        onChange={(e) => setCid(e.target.value)}
      />

      <button onClick={handleDownload}>
        Open File
      </button>
    </div>
  );
}

export default Download;