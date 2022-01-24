import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { ChainContext } from '../../contexts/chain';
import EthereumChain from '../../utils/EthereumChain';
import { useIsMobile } from '../../utils/isMobile';
import Button from '../Button';
import Row from '../Row';
import Spacer from '../Spacer';
import Typography from '../Typography';

const IMAGE_SIZE = 32;

const Container = styled(Row)`
  padding: 16px 32px 0;
  flex: 0 1 ${IMAGE_SIZE}px;

  @media screen and (max-width: 800px) {
    padding: 16px 16px 0;
  }
`;

const LogoContainer = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const Header: React.FC = () => {
  const { isOnSupportedChain } = useContext(ChainContext);

  const isMobile = useIsMobile();

  const { pathname } = useRouter();

  const isOnAboutPage = pathname === '/about';

  const handleSwitchNetwork = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: EthereumChain.chainId }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [EthereumChain],
            });
          } catch (addError) {
            console.error('Error adding Ethereum chain to MetaMask', addError);
          }
        } else {
          console.error(
            'Error switching Ethereum chain in MetaMask',
            switchError,
          );
        }
      }
    }
  };

  return (
    <Container justifyContent="space-between" alignItems="center">
      <Link href="/">
        <LogoContainer>
          <Image
            src="/assets/colorz-small.png"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            alt="Palm tree"
          />
          <Spacer width={16} />
          <Typography as="h4">Colorz</Typography>
        </LogoContainer>
      </Link>
      <Row alignItems="center">
        <Link href="/about">
          <Typography
            as="a"
            secondary={!isOnAboutPage}
            underline={isOnAboutPage}
          >
            About
          </Typography>
        </Link>
        {!isMobile && !isOnSupportedChain && (
          <>
            <Spacer width={16} />
            <Button onClick={handleSwitchNetwork} secondary>
              Switch network
            </Button>
          </>
        )}
      </Row>
    </Container>
  );
};

export default Header;
