import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ZeroAddress } from "ethers";


export default buildModule("PermaRent", (m) => {
    const schemaId = m.getParameter("schemaId", 0);
    const keySchemaId = m.getParameter("keySchemaId", 0);
    const worldVerifierAddress = m.getParameter("worldVerifierAddress", ZeroAddress);
    const spAddress = m.getParameter("spAddress", ZeroAddress);
    const PRPAddress = m.getParameter("PRPAddress", ZeroAddress);
    const spHookAddress = m.getParameter("spHookAddress", ZeroAddress);
    const spHook = m.contractAt("PermaSPHook", spHookAddress, {});
    const permaRent = m.contract("PermaRent", [spAddress, spHookAddress, PRPAddress, worldVerifierAddress, schemaId, keySchemaId]);
    m.call(spHook, "setPerma", [permaRent]);

    return { permaRent };
});