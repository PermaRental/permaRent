import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PermaSPHookModule = buildModule("PermaSPHook", (m) => {

    const spHook = m.contract("PermaSPHook", [], {});

    return { spHook };
});

export default PermaSPHookModule;