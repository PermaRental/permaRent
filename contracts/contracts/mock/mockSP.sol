// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SP} from "@ethsign/sign-protocol-evm/src/core/SP.sol";

contract MockSP is SP {
    constructor() SP() {}
}