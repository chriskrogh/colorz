import React, { useEffect, useState } from 'react';

import EthereumChain from '../../utils/EthereumChain';
import { ChainContext } from './state';

const Provider: React.FC = ({ children }) => {
  const [isOnSupportedChain, setIsOnSupportedChain] = useState(
    typeof window !== 'undefined' &&
      (window as any).ethereum?.networkVersion &&
      EthereumChain.chainId ===
        `0x${parseInt((window as any).ethereum.networkVersion).toString(16)}`,
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', (chainId: string) => {
        setIsOnSupportedChain(EthereumChain.chainId === chainId);
      });
    }
  }, []);

  return (
    <ChainContext.Provider
      value={{
        isOnSupportedChain,
        setIsOnSupportedChain,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export default Provider;
