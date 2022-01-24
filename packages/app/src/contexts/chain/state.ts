import { createContext } from 'react';

export type State = {
  isOnSupportedChain: boolean;
  setIsOnSupportedChain: (isOnSupportedChain: boolean) => void;
};

export const initialState: State = {
  isOnSupportedChain: false,
  setIsOnSupportedChain: (isOnSupportedChain: boolean) => {
    void isOnSupportedChain;
  },
};

export const ChainContext = createContext(initialState);
