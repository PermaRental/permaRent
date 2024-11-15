// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;
import {IWorldID} from "./interfaces/IWorldID.sol";
import "./error.sol";
library ByteHasher {
    /// @dev Creates a keccak256 hash of a bytestring.
    /// @param value The bytestring to hash
    /// @return The hash of the specified value
    /// @dev `>> 8` makes sure that the result is included in our field
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}

contract WorldVerifier {
    using ByteHasher for bytes;

    IWorldID internal immutable worldId;
    uint256 internal immutable signNullifierHash;
    uint256 internal immutable groupId = 1;
    mapping(uint256 => bool) internal nullifierHashes;

    /// @notice Deploy an instance of WorldVerifier
    /// @param _worldId The WorldID contract address
    /// @param _appId The app ID
    constructor(
        address _worldId,
        string memory _appId
    ) {
        if (_worldId == address(0)) revert ZeroAddress();

        worldId = IWorldID(_worldId);
        signNullifierHash = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), "sign")
            .hashToField();
    }

    function verifyWorldSignAction(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        verifyAndExecute(
            signal,
            root,
            nullifierHash,
            proof,
            signNullifierHash
        );
    }

    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint256 externalNullifierHash
    ) internal {
        // First, we make sure this person hasn't done this before

        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // We now record the user has done this, so they can't do it again (sybil-resistance)
        nullifierHashes[nullifierHash] = true;
    }
}
