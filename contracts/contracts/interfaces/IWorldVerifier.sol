// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IWorldVerifier {
     function verifyWorldSignAction(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external;
}