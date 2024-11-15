import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ZeroAddress } from "ethers";

export default buildModule("PermaReputationPoints", (m) => {
    const spHookAddress = m.getParameter("signProtocolHookAddress", ZeroAddress);

    const PRP = m.contract("PermaReputationPoints", [spHookAddress], {});

    return { PRP };
});