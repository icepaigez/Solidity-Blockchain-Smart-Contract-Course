//SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";


contract Lottery is Ownable, VRFConsumerBase {

	using SafeMathChainlink for uint256;

	bytes32 public keyHash;
    uint256 public fee;

    uint256 public randomResult;

	address payable[] public players;
	uint256 public usdEntryFee;
	address payable public recentWinner;
	AggregatorV3Interface internal priceFeed;
	enum LOTTERY_STATE {
		OPEN,
		CLOSED,
		CALCULATING_WINNER
	}

	LOTTERY_STATE public lottery_state;

	constructor(address _priceFeed, address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee) public VRFConsumerBase(_vrfCoordinator, _link) {
		usdEntryFee = 50 * 10**18;
		priceFeed = AggregatorV3Interface(_priceFeed);
		lottery_state = LOTTERY_STATE.CLOSED;
		keyHash = _keyHash;
		fee = _fee;
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

	function endLottery() public onlyOwner {
		require(lottery_state == LOTTERY_STATE.OPEN);
		lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
		bytes32 requestId = requestRandomness(keyHash, fee);
	}

	function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER);
        randomResult = randomness;
        uint256 indexOfWinner = randomResult % players.length;
        recentWinner = payable(players[indexOfWinner]);
        recentWinner.transfer(address(this).balance);
        players = new address payable[](0);
        lottery_state = LOTTERY_STATE.CLOSED;
    }
}