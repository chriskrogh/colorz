//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract Color is ERC721 {
  uint public supply;
  string[] public colors;
  mapping(string => bool) _colorExists;

  constructor() ERC721("Color", "COLOR") {
    supply = 0;
  }

  function mint(string memory _color) public {
    require(!_colorExists[_color], 'Color already exists');

    colors.push(_color);
    supply = colors.length;
    uint _id = supply;

    _mint(msg.sender, _id);

    _colorExists[_color] = true;
  }
}
