//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BoxV2 {
	uint256 private value;

	event ValueChanged(uint256 newValue);

	function setValue(uint256 newValue) public {
		value = newValue;
		emit ValueChanged(value);
	}

	function getValue() public view returns (uint256) {
		return value;
	}

	function increment() public {
		value = value + 1;
		emit ValueChanged(value);
	}
}