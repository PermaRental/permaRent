// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import {ISPHook, IERC20} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";


interface IPermaSPHook is ISPHook{
    function setWhitelist(address attester, bool allowed) external;
}
