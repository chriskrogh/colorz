import { ethers } from 'hardhat';

import { Color, Color__factory } from '../generated';

describe('Color', function () {
  let color: Color;

  beforeEach(async function () {
    const Color = (await ethers.getContractFactory('Color')) as Color__factory;
    color = await Color.deploy(
      'Color',
      'COLOR',
      '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9',
      '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
      '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
      '1',
    );
    await color.deployed();
  });
});