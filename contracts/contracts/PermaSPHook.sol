// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISPHook, IERC20} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {PermaReputationPoints} from "./PermaReputationPoints.sol";
import {IWorldVerifier} from "./interfaces/IWorldVerifier.sol";
import {UnauthorizedAttester} from "./error.sol";

contract PermaSPHook is ISPHook, Ownable(msg.sender) {
    mapping(address attester => bool allowed) public whitelist;


    constructor() {}

    function setWhitelist(address attester, bool allowed) external onlyOwner {
        whitelist[attester] = allowed;
    }

    function _checkAttesterWhitelistStatus(address attester) internal view {
        if (!whitelist[attester]) {
            revert UnauthorizedAttester();
        }
    }

    function didReceiveAttestation(
        address attester,
        uint64, // schemaId,
        uint64, // attestationId,
        bytes calldata //extraData
    ) external payable {
        _checkAttesterWhitelistStatus(attester);
    }

    function didReceiveAttestation(
        address attester,
        uint64, //schemaId,
        uint64, //attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external {
        (address lessor, address lessee) = abi.decode(extraData, (address, address));
        _checkAttesterWhitelistStatus(attester);
        PermaReputationPoints(address(resolverFeeERC20Token)).mint(
            lessor,
            resolverFeeERC20Amount
        );
        PermaReputationPoints(address(resolverFeeERC20Token)).mint(
            lessee,
            resolverFeeERC20Amount
        );
    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId,
        uint64, // attestationId,
        bytes calldata //extraData
    ) external payable {
        _checkAttesterWhitelistStatus(attester);
    }

    function didReceiveRevocation(
        address attester,
        uint64, //schemaId,
        uint64, // attestationId,
        IERC20, // resolverFeeERC20Token,
        uint256, // resolverFeeERC20Amount,
        bytes calldata //extraData
    ) external view {
        _checkAttesterWhitelistStatus(attester);
    }
}
