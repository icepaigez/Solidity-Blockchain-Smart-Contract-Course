//SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Lottery is Ownable {

	using SafeMathChainlink for uint256;

	address payable[] public players;
	uint256 public usdEntryFee;
	AggregatorV3Interface internal priceFeed;
	enum LOTTERY_STATE {
		OPEN,
		CLOSED,
		CALCULATING_WINNER
	}

	LOTTERY_STATE public lottery_state;

	constructor(address _priceFeed) public {
		usdEntryFee = 50 * 10**18;
		priceFeed = AggregatorV3Interface(_priceFeed);
		lottery_state = LOTTERY_STATE.CLOSED;
	}
	
	function enter() public payable {
		require(lottery_state == LOTTERY_STATE.OPEN);
		require(msg.value >= getEntranceFee(), "Not enough ETH!");
		players.push(msg.sender);
	}

	function getEntranceFee() public view returns(uint256) {
		(, int price,,,) = priceFeed.latestRoundData();
		uint256 adjustedPrice = uint256(price) * 10**10;
		uint256 entryFee = (usdEntryFee * 10**18) / adjustedPrice;
		return entryFee;
	}
	function startLottery() public onlyOwner {
		require(lottery_state == LOTTERY_STATE.CLOSED);
		lottery_state = LOTTERY_STATE.OPEN;
	}
	function endLottery() public {}
}