import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';

import Column from '../../components/Column';
import Spacer from '../../components/Spacer';
import Typography from '../../components/Typography';

const Container = styled(Column)`
  width: min(calc(100% - 32px), 800px);
`;

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>Colorz - About</title>
        <meta
          name="description"
          content="Learn more about the inspiration behind Colorz"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Column alignItems="center" fullWidth>
        <Container>
          <Typography as="p">
            by <a href="https://chriskrogh.com">Chris Krogh</a>
          </Typography>
          <Typography as="p">24th January, 2021</Typography>
          <Spacer height={16} />
          <Typography as="h4" secondary>
            Background & Motivation
          </Typography>
          <Spacer height={8} />
          <Typography as="p">
            Throughout the course of 2021, I became increasingly interested in
            the crypto / web 3 world. I was fascinated by the paradigms that
            these concepts introduced (trust, ownership and transparency), and
            found it quite difficult to ignore the potential impact that
            blockchain networks like Ethereum could have at scale.
          </Typography>
          <Spacer height={16} />
          <Typography as="p">
            I think it would be pretty cool to get a job in the industry, so I
            decided to get some experience with the relevant tools and
            frameworks (Solidity, Hardhat, Ethers JS) by building Dapps, like
            Colorz.
          </Typography>
          <Spacer height={16} />
          <Typography as="h4" secondary>
            Overview
          </Typography>
          <Spacer height={8} />
          <Typography as="p">
            Colorz is a really simple Dapp that allows users to mint colors as
            NFTs to the blockchain. I initially started off by trying to mint
            random colors using{' '}
            <a href="https://docs.chain.link/docs/get-a-random-number/">
              Chainlink VRF
            </a>{' '}
            but I encountered some issues with running chainlink locally which
            made it really hard to test the smart contracts. Eventually I
            decided to allow users to mint their own colors.
          </Typography>
          <Spacer height={16} />
          <Typography as="h4" secondary>
            Network
          </Typography>
          <Spacer height={8} />
          <Typography as="p">
            The token's contract is deployed on Polygon's Mumbai test network,
            so none of the transactions require real MATIC to be signed or
            processed. To add the network to your wallet, you can head over to{' '}
            <a href="https://chainlist.org/">Chainlist</a>, search for "mumbai"
            and add the Polygon test network.
          </Typography>
          <Spacer height={32} />
        </Container>
      </Column>
    </>
  );
};

export default About;
