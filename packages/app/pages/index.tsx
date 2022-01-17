import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { useIsMobile } from '../src/utils/isMobile';

const DynamicMobileSection = dynamic(() => import('./landing/Mobile'));
const DynamicDesktopSection = dynamic(() => import('./landing/Desktop'));

const Home: NextPage = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Head>
        <title>Colorz</title>
        <meta
          name="description"
          content="Colorz is a random color NFT generator. It mints a random color as an NFT to the user's address."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isMobile ? <DynamicMobileSection /> : <DynamicDesktopSection />}
    </>
  );
};

export default Home;
