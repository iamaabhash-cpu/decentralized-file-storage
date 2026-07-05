import { ethers } from "ethers";
import FileStorage from "../abi/FileStorage.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = new ethers.BrowserProvider(window.ethereum);

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    FileStorage.abi,
    signer
  );

  return contract;
}