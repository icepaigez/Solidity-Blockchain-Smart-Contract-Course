//SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";


contract Lottery {

	using SafeMathChainlink for uint256;

	address payable[] public players;
	uint256 public usdEntryFee;
	AggregatorV3Interface internal priceFeed;

	constructor(address _priceFeed) public {
		usdEntryFee = 50 * 10**18;
		priceFeed = AggregatorV3Interface(_priceFeed);
	}
	
	function enter() public payable {
		players.push(msg.sender);
	}
	function getEntranceFee() public view returns(uint256) {
		(, int price,,,) = priceFeed.latestRoundData();
	}
	function startLottery() public {}
	function endLottery() public {}
}