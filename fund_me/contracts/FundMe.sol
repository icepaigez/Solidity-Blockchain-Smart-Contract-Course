//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";

contract FundMe {

    using SafeMathChainlink for uint256;
    AggregatorV3Interface public priceFeed;

    address public owner;
    mapping (address => uint256) public donor;
    mapping (address => bool) public donorIndex;
    address[] public donors;

    constructor(address _priceFeed) public {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function entranceFee() public view returns (uint256) {
        uint256 minimumAmount = 50 * 10**18;
        uint256 precision = 1 * 10**18;
        uint256 usdToEth = (minimumAmount * precision) / getPrice();
        return usdToEth;
    }

    function fund() public payable {
        require(msg.value >= entranceFee(), "You need to send at least the ether equivalent of $50");
        donor[msg.sender] += msg.value;
        if (donorIndex[msg.sender] == false) {
            donorIndex[msg.sender] = true;
            donors.push(msg.sender);
        }
    }

    function getDonorCount() public view returns (uint256) {
        return donors.length;
    }

    function getPrice() public view returns (uint256) {
        (, int price,,,) = priceFeed.latestRoundData();
        return uint256(price * 10**10);
    }

    function withdraw() public payable onlyOwner {
        address payable accountant = payable(msg.sender);
        accountant.transfer(address(this).balance);
        for (uint256 i = 0; i < donors.length; i++) {
            address funder = donors[i];
            donor[funder] = 0;
        }
        donors = new address[](0);
    }
}