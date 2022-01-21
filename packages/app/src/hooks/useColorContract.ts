import axios from 'axios';
import { useState } from 'react';

export const SUCCESS_TIMEOUT = 5000;

type HookReturn = {
  requestColors: (address: string) => Promise<void>;
  loading: boolean;
  success: boolean;
};

export const useTokenContract = (): HookReturn => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_TIMEOUT);
  };

  const requestColors = async (address: string) => {
    setLoading(true);
    try {
      await axios.get(`/api/colors/request?address=${address}`);
      handleSuccess();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return {
    requestColors,
    loading,
    success,
  };
};
