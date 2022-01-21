import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

import ColorArtifact from '../../../../../blockchain/artifacts/contracts/Color.sol/Color.json';
import { Color as ColorContract } from '../../../../../blockchain/generated/Color';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { address } = req.query;

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY ?? '',
      provider,
    );

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_COLOR_CONTRACT_ADDRESS ?? '',
      ColorArtifact.abi,
      wallet,
    ) as ColorContract;

    const mintTransaction = await contract.requestColors(address as string);
    await mintTransaction.wait();
    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false });
  }
};
