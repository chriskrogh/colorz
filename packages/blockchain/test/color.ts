import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { Color, Color__factory } from '../generated';

describe('Color', function () {
  let color: Color;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    const Color = (await ethers.getContractFactory('Color')) as Color__factory;
    color = await Color.deploy();
    await color.deployed();
    [owner] = await ethers.getSigners();
  });

  describe('minting', () => {
    it('creates a new token', async () => {
      await color.mint('#EC058E');
      const balance = await color.balanceOf(owner.address);
      expect(balance).to.eq(1);
    });

    it('does not create duplicates', async () => {
      await color.mint('#EC058E');
      await expect(color.mint('#EC058E')).to.be.revertedWith(
        'Color already exists',
      );
    });
  });

  describe('indexing', () => {
    it('indexes colors', async () => {
      const originalColors = ['#EC058E', '#A23E5C'];
      await Promise.all(originalColors.map(async (c) => await color.mint(c)));

      const fetchedColors = [];
      const supply = (await color.supply()).toNumber();
      for (let i = 0; i < supply; i++) {
        fetchedColors.push(await color.colors(i));
      }

      expect(fetchedColors).to.deep.eq(originalColors);
    });
  });
});
