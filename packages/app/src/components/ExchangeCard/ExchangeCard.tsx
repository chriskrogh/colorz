import WalletConnectProvider from '@walletconnect/web3-provider';
import copy from 'copy-to-clipboard';
import { ethers } from 'ethers';
import { Formik, FormikHelpers } from 'formik';
import React, { useContext, useState } from 'react';
import { Option } from 'react-dropdown';
import styled from 'styled-components';
import Web3Modal from 'web3modal';

import { WalletContext } from '../../contexts/wallet';
import {
  SUCCESS_TIMEOUT,
  useTokenContract,
} from '../../hooks/useTokenContract';
import { COLORS } from '../../utils/colors';
import { Country, CurrencyPairs } from '../../utils/Currency';
import Button from '../Button';
import Clickable from '../Clickable';
import Column from '../Column';
import Dropdown from '../Dropdown';
import Loader from '../Loader';
import Row from '../Row';
import Spacer from '../Spacer';
import TextInput from '../TextInput';
import TimerBar from '../TimerBar';
import Typography from '../Typography';
import Summary from './Summary';
import { validationSchema } from './validation';

const Container = styled(Column)`
  padding: 32px;
  width: min(calc(100% - 64px), 430px);
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 16px;

  @media screen and (max-width: 800px) {
    padding: 16px;
    width: calc(100% - 32px);
  }
`;

const DOT_SIZE = 12;
const ConnectedDot = styled.div`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  border-radius: 50%;
  background-color: ${COLORS.success};
`;

const LeanButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

type FormValues = {
  amount: string;
  walletAddress: string;
};

const connectWallet = async (): Promise<
  ethers.providers.Web3Provider | undefined
> => {
  try {
    if (typeof window !== undefined && window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    } else {
      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true, // optional
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // required
            },
          },
        },
      });
      const provider = await web3Modal.connect();
      return new ethers.providers.Web3Provider(provider);
    }
  } catch (error) {
    console.error(error);
  }
};

const ExchangeCard: React.FC = () => {
  const { address } = useContext(WalletContext);

  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [country, setCountry] = useState<Country>('TT');
  const [copied, setCopied] = useState(false);

  const handleCountryChange = (option: Option) =>
    setCountry(option.value as Country);

  const handleCopy = () => {
    copy(CurrencyPairs[country].crypto.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), SUCCESS_TIMEOUT);
  };

  const setBuy = () => setAction('buy');
  const setSell = () => setAction('sell');

  const {
    mintTokens,
    requestApproval,
    burnTokens,
    loading,
    approved,
    success,
  } = useTokenContract();

  const initialFormValues: FormValues = {
    amount: '',
    walletAddress: address,
  };

  const submit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    const { amount, walletAddress } = values;
    try {
      if (action === 'buy') {
        await mintTokens(walletAddress, parseFloat(amount));
        resetForm({ values: initialFormValues });
      } else if (action === 'sell') {
        const provider = await connectWallet();
        if (!provider) throw new Error();

        const formattedAmount = ethers.utils.parseEther(amount.toString());
        if (!approved) {
          await requestApproval(provider, walletAddress, formattedAmount);
        } else {
          await burnTokens(provider, walletAddress, formattedAmount);
          resetForm({ values: initialFormValues });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [currentCurrency, desiredCurrency] =
    action === 'buy'
      ? [CurrencyPairs[country].fiat, CurrencyPairs[country].crypto]
      : [CurrencyPairs[country].crypto, CurrencyPairs[country].fiat];

  return (
    <Container>
      <Row>
        <Clickable onClick={setBuy}>
          <Typography as="h4" secondary={action === 'sell'} bold>
            Buy {CurrencyPairs[country].crypto.symbol}
          </Typography>
        </Clickable>
        <Spacer width={16} />
        <Clickable onClick={setSell}>
          <Typography as="h4" secondary={action === 'buy'} bold>
            Sell {CurrencyPairs[country].crypto.symbol}
          </Typography>
        </Clickable>
      </Row>
      <Spacer height={16} />
      <Formik
        validationSchema={validationSchema}
        initialValues={initialFormValues}
        onSubmit={submit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <Row justifyContent="space-between" fullWidth>
              <Typography as="p">Currency</Typography>
              {!copied ? (
                <LeanButton onClick={handleCopy}>
                  <Typography as="p" secondary>
                    Copy contract address
                  </Typography>
                </LeanButton>
              ) : (
                <Typography as="p" color={COLORS.success}>
                  Copied
                </Typography>
              )}
            </Row>
            <Spacer height={4} />
            <Dropdown
              options={Object.keys(CurrencyPairs).map((key) => ({
                label: CurrencyPairs[key as Country].crypto.symbol,
                value: key,
              }))}
              onChange={handleCountryChange}
              value={CurrencyPairs[country].crypto.symbol}
              fullWidth
            />
            <Spacer height={16} />
            <Row justifyContent="space-between" fullWidth>
              <Typography as="p">Amount</Typography>
              <Typography as="p">
                {desiredCurrency.symbol}/{currentCurrency.symbol}
              </Typography>
            </Row>
            <Spacer height={4} />
            <TextInput
              onChange={handleChange('amount')}
              onBlur={handleBlur('amount')}
              value={values.amount}
              disabled={approved}
              placeholder="0.00"
              type="number"
              fullWidth
            />
            {errors.amount && (
              <>
                <Spacer height={4} />
                <Typography as="p" color={COLORS.error}>
                  {errors.amount}
                </Typography>
              </>
            )}
            <Spacer height={16} />
            <Row justifyContent="space-between" fullWidth>
              <Typography as="p">Wallet Address</Typography>
              {address && (
                <Row alignItems="center">
                  <ConnectedDot />
                  <Spacer width={8} />
                  <Typography as="p">Connected</Typography>
                </Row>
              )}
            </Row>
            <Spacer height={4} />
            {action === 'sell' && !address ? (
              <Button onClick={connectWallet} secondary fullWidth>
                Connect Wallet
              </Button>
            ) : (
              <TextInput
                onChange={handleChange('walletAddress')}
                onBlur={handleBlur('walletAddress')}
                value={values.walletAddress}
                disabled={action === 'sell'}
                placeholder="0x... or .eth"
                type="text"
                fullWidth
              />
            )}
            {errors.walletAddress && (
              <>
                <Spacer height={4} />
                <Typography as="p" color={COLORS.error}>
                  {errors.walletAddress}
                </Typography>
              </>
            )}
            <Spacer height={16} />
            <Summary
              {...{
                amount: Number(values.amount) || 0,
                currentCurrency,
                desiredCurrency,
              }}
            />
            <Spacer height={32} />
            <Row fullWidth>
              {action === 'sell' && (
                <>
                  <Button
                    onClick={handleSubmit as () => void}
                    type="submit"
                    disabled={loading || approved}
                    fullWidth
                    secondary
                  >
                    {`1.\u00A0Approve`}
                  </Button>
                  <Spacer width={16} />
                </>
              )}
              <Button
                onClick={handleSubmit as () => void}
                type="submit"
                disabled={loading || (action === 'sell' && !approved)}
                fullWidth
              >
                {`${action === 'sell' ? '2.\u00A0' : ''}Confirm`}
              </Button>
            </Row>
          </>
        )}
      </Formik>
      {(loading || success) && (
        <>
          <Spacer height={32} />
          <Column alignItems="center" fullWidth>
            {loading && <Loader />}
            {success && (
              <>
                <Typography as="p" color={COLORS.success}>
                  Your transaction was successful!
                </Typography>
                <TimerBar duration={SUCCESS_TIMEOUT} color={COLORS.success} />
              </>
            )}
          </Column>
        </>
      )}
    </Container>
  );
};

export default ExchangeCard;
