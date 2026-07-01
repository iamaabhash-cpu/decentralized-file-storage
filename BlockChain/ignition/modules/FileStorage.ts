import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FileStorageModule", (m) => {
  const fileStorage = m.contract("FileStorage");

  return { fileStorage };
});