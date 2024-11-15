import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ZeroAddress } from "ethers";


export default buildModule("WorldVerifier", (m) => {

    const worldIdAddress = m.getParameter("worldIdAddress", ZeroAddress);

    const worldAppID = m.getParameter("worldAppID", "");
    const worldVerifier = m.contract("WorldVerifier", [worldIdAddress, worldAppID]);


    return { worldVerifier };
});