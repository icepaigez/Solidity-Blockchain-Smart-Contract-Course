//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract SimpleStorage {

    uint256 favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;
    mapping (string => uint256) public nameToFavNumber;

    function setFavoriteNumber(uint256 _favNum) public {
        favoriteNumber = _favNum;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(uint256 _favNum, string memory _name) public {
        people.push(People({ favoriteNumber:_favNum, name:_name }));
        nameToFavNumber[_name] = _favNum;
    }

}