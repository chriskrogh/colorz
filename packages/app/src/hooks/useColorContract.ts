import { ethers } from 'ethers';
import { useContext } from 'react';
import { useEffect, useState } from 'react';

import ColorArtifact from '../../../blockchain/artifacts/contracts/Color.sol/Color.json';
import { Color as ColorContract } from '../../../blockchain/generated/Color';
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
  requestColors: () => Promise<void>;
  colors: string[];
  loading: boolean;
  success: boolean;
};

export const useColorContract = (): HookReturn => {
  const { address } = useContext(WalletContext);

  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      if (address) {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
        );
        const contract = buildColorContract(provider);
        const balance = (await contract.balanceOf(address)).toNumber();
        console.log(balance);

        const filter = contract.filters.ColorCreated(address);
        provider.on(filter, (log, event) => {
          console.log(log, event);
        });
      }
    })();
  }, [address]);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_TIMEOUT);
  };

  const requestColors = async () => {
    setLoading(true);
    try {
      if (address) {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
        );
        const contract = buildColorContract(provider);
        const request = await contract.requestColors(address);
        await request.wait();
        handleSuccess();
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return {
    requestColors,
    colors,
    loading,
    success,
  };
};
