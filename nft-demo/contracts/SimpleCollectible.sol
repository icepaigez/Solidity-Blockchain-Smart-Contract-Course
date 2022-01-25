//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleCollectible is ERC721 {

	uint256 public tokenCounter;

	mapping (address => bool) public holders;

	constructor() public ERC721("Dogie", "DOG") {}

	function createCollectible(string memory tokenURI) public returns (uint256) {
		require(holders[msg.sender] != true);
		uint256 newTokenId = tokenCounter;
		_safeMint(msg.sender, newTokenId);
		_setTokenURI(newTokenId, tokenURI);
		tokenCounter = tokenCounter + 1;
		holders[msg.sender] = true; //only one NFT per address
		return newTokenId;
	}
}

//21 feb ope checkup