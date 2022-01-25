//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AdvancedCollectible is ERC721, VRFConsumerBase {

	uint256 public tokenCounter;
	uint256 internal randomResult; //this will be used on the frontend to select random nft art
	bytes32 internal keyHash;
    uint256 internal fee;
    
    enum PLAYER_ART {PUG, SHIBA, BERNARD}

    //send the random number generated to the front end; store the nft art there
    //and select an nft art based on the randon number % length of nft art data store
    //this is because the enum max character size is 256 members and we need to store 
    //millions of nft art

    mapping (address => bool) public holders;
    mapping (bytes32 => address) public playerToRequestId;
    mapping (uint256 => PLAYER_ART) public tokenIdToPlayerArt;

    constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee) public ERC721("Poker", "PKR") VRFConsumerBase(_vrfCoordinator, _link) {
    	keyHash = _keyHash;
    	fee = _fee;
    }

    function createCollectible() public returns (bytes32 requestId) {
    	bytes32 requestId = requestRandomness(keyHash, fee);
		playerToRequestId[requestId] = msg.sender;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    	PLAYER_ART player_art = PLAYER_ART(randomness % 3); //returns a random player art
    	randomResult = randomness;
    	uint256 newTokenId = tokenCounter;
    	tokenIdToPlayerArt[newTokenId] = player_art;
    	address sender = playerToRequestId[requestId];
    	_safeMint(sender, newTokenId);
    	//_setTokenURI(newTokenId, tokenURI);
    	tokenCounter = tokenCounter + 1;
    }
}