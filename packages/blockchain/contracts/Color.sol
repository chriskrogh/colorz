//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Color is ERC721, VRFConsumerBase {
  bytes32 internal keyHash;
  uint256 internal fee;

  mapping(address => uint256[]) private colors;
  mapping(bytes32 => address) private requests;

  event ColorRequested(bytes32 indexed requestId, address indexed minter);
  event ColorCreated(bytes32 indexed requestId, uint256 indexed color);

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

  function requestColor() public {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");

    bytes32 requestId = requestRandomness(keyHash, fee);
    requests[requestId] = msg.sender;

    emit ColorRequested(requestId, msg.sender);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    colors[requests[requestId]].push(randomness);
    _mint(requests[requestId], randomness);

    emit ColorCreated(requestId, randomness);
  }

  function uintToHex(uint256 color) private pure returns (string memory) {
    if (color == 0) return "0";

    uint256 j = color;
    uint length = 0;
    while (j != 0) {
      length++;
      j = j >> 4;
    }

    uint mask = 15;
    bytes memory bstr = new bytes(length);
    uint k = length;
    while (color != 0) {
      uint curr = (color & mask);
      bstr[--k] = curr > 9 ?
        bytes1(uint8(55 + curr)) :
        bytes1(uint8(48 + curr));
      color = color >> 4;
    }

    return string(bstr);
  }

  function getColors(address owner) public view returns (string[] memory) {
    string[] memory result = new string[](colors[owner].length);
    for (uint i = 0; i < colors[owner].length; i++) {
      result[i] = uintToHex(colors[owner][i]);
    }
    return result;
  }
}
