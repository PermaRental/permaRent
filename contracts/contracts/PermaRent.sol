// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PermaRentDeal.sol";

contract PermaRent {
    address signProtocol;
    address prpToken;
    address worldVerifier;
    uint64 schemaId;
    event DealCreated(
        address indexed deal,
        address indexed paymentToken,
        address indexed lessor,
        PermaRentDeal.DealTerms terms
    );
    

    constructor(
        address _signProtocol,
        address _prpToken,
        address _worldVerifier,
        uint64 _schemaId
    ) {
        signProtocol = _signProtocol;
        prpToken = _prpToken;
        worldVerifier = _worldVerifier;
        schemaId = _schemaId;
    }

    function deployDeal(
        address _paymentToken,
        address _lessor,
        PermaRentDeal.DealTerms memory _terms
    ) public returns (address) {
        PermaRentDeal newDeal = new PermaRentDeal(
            _paymentToken,
            prpToken,
            _lessor,
            signProtocol,
            worldVerifier,
            schemaId,
            _terms
        );
        emit DealCreated(address(newDeal), _paymentToken, _lessor, _terms);
        return address(newDeal);
    }

}
