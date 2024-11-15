// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PermaRentDeal.sol";
import {IPermaSPHook} from "./interfaces/IPermaSPHook.sol";

contract PermaRent {
    address signProtocol;
    address spHook;
    address prpToken;
    address worldVerifier;
    uint64 approvedSchemaId;
    uint64 setKeySchemaId;
    event DealCreated(
        address indexed deal,
        address indexed paymentToken,
        address indexed lessor,
        PermaRentDeal.DealTerms terms
    );
    

    constructor(
        address _signProtocol,
        address _spHook,
        address _prpToken,
        address _worldVerifier,
        uint64 _approvedSchemaId,
        uint64 _setKeySchemaId
    ) {
        signProtocol = _signProtocol;
        spHook = _spHook;
        prpToken = _prpToken;
        worldVerifier = _worldVerifier;
        approvedSchemaId = _approvedSchemaId;
        setKeySchemaId = _setKeySchemaId;
    }

    function deployDeal(
        address _paymentToken,
        address _lessor,
        PermaRentDeal.DealTerms memory _terms
    ) public returns (address) {
        PermaRentDeal newDeal = new PermaRentDeal(
            signProtocol,
            prpToken,
            _paymentToken,
            worldVerifier,
            _lessor,
            approvedSchemaId,
            setKeySchemaId,
            _terms
        );
        IPermaSPHook(spHook).setWhitelist(address(newDeal), true);
        emit DealCreated(address(newDeal), _paymentToken, _lessor, _terms);
        return address(newDeal);
    }

}
