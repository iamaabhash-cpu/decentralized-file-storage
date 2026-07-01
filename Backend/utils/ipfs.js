const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function uploadToIPFS(filePath) {
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      maxBodyLength: Infinity,
      headers: {
        ...data.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    }
  );

  return {
    cid: res.data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
  };
}

module.exports = uploadToIPFS;