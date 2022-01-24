import type { NextPage } from 'next';
import Head from 'next/head';

import Landing from './landing';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Colorz</title>
        <meta
          name="description"
          content="Colorz is a color NFT generator. You can mint colors as NFTs to your address."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing />
    </>
  );
};

export default Home;
