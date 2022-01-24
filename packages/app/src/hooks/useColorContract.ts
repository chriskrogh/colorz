import { ethers } from 'ethers';
import { useContext } from 'react';
import { useEffect, useState } from 'react';

import ColorArtifact from '../../../blockchain/artifacts/contracts/Color.sol/Color.json';
import { Color as ColorContract } from '../../../blockchain/generated/Color';
import { ChainContext } from '../contexts/chain';
import { WalletContext } from '../contexts/wallet';

export const SUCCESS_TIMEOUT = 5000;

const buildColorContract = (
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
): ColorContract =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_COLOR_CONTRACT_ADDRESS ?? '',
    ColorArtifact.abi,
    provider.getSigner(),
  ) as ColorContract;

type HookReturn = {
  mintColor: (color: string) => Promise<void>;
  colors: string[];
  loading: boolean;
  success: boolean;
};

export const useColorContract = (): HookReturn => {
  const { isOnSupportedChain } = useContext(ChainContext);
  const { address } = useContext(WalletContext);

  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      if (isOnSupportedChain && address) {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
        );
        const contract = buildColorContract(provider);
        const supply = (await contract.supply()).toNumber();
        const colors = [];
        for (let i = 0; i < supply; i++) {
          colors.push(await contract.colors(i));
        }
        setColors(colors);
      }
    })();
  }, [isOnSupportedChain, address]);

  const mintColor = async (color: string) => {
    setLoading(true);
    try {
      if (address) {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
        );
        const contract = buildColorContract(provider);
        const request = await contract.mint(color);
        await request.wait();
        setColors([...colors, color]);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, SUCCESS_TIMEOUT);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return {
    mintColor,
    colors,
    loading,
    success,
  };
};
