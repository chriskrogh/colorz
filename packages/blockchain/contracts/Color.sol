//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";

contract Color is ERC721, VRFConsumerBase {
  bytes32 internal keyHash;
  uint256 internal fee;

  string[] public colors;
  mapping(string => address) public colorOwners;
  mapping(bytes32 => address) private requests;

  event ColorsRequested(bytes32 indexed requestId, address indexed minter);
  event ColorCreated(bytes32 indexed requestId, string indexed color);

  constructor(
    string memory _name,
    string memory _symbol,
    address _vrfCoordinator,
    address _link,
    bytes32 _keyHash,
    uint256 _fee
  ) ERC721(_name, _symbol) VRFConsumerBase(_vrfCoordinator, _link) {
    keyHash = _keyHash;
    fee = _fee;
  }

  function substring(string memory str, uint startIndex, uint endIndex) private pure returns (string memory) {
    bytes memory strBytes = bytes(str);
    bytes memory result = new bytes(endIndex-startIndex);
    for(uint i = startIndex; i < endIndex; i++) {
      result[i-startIndex] = strBytes[i];
    }
    return string(result);
  }

  function uintToHexes(uint256 num) public pure returns (string[] memory) {
    // if the num is 0, return an empty array
    if (num == 0) return new string[](0);

    // determine the hexadecimal length of the num
    uint256 i = num;
    uint length = 0;
    while (i != 0) {
      length++;
      i = i >> 4;
    }

    // convert the num to hexadecimal
    uint mask = 15;
    uint j = length;
    bytes memory bstr = new bytes(length);
    while (num != 0) {
      uint curr = (num & mask);
      bstr[--j] = curr > 9 ?
        bytes1(uint8(55 + curr)) :
        bytes1(uint8(48 + curr));
      num = num >> 4;
    }
    string memory longHex = string(bstr);

    // split the hexadecimal into groups of 6
    uint k = 0;
    uint numHexes = length / 6;
    string[] memory hexes = new string[](numHexes);
    while(k < numHexes) {
      uint base = k * 6;
      hexes[k++] = substring(longHex, base, base + 6);
    }
    return hexes;
  }

  function requestColors(address owner) public {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");

    bytes32 requestId = requestRandomness(keyHash, fee);
    requests[requestId] = owner;

    emit ColorsRequested(requestId, owner);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    string[] memory hexes = uintToHexes(randomness);
    for(uint i = 0; i < hexes.length; i++) {
      if (colorOwners[hexes[i]] == address(0)) {
        // add color to mapping
        colors.push(hexes[i]);
        colorOwners[hexes[i]] = requests[requestId];

        // mint color
        _mint(requests[requestId], colors.length - 1);

        // emit event
        emit ColorCreated(requestId, hexes[i]);
      }
    }
  }
}
