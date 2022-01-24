import './index.css';

import type { AppProps } from 'next/app';

import Header from '../src/components/Header';
import Page from '../src/components/Page';
import Spacer from '../src/components/Spacer';
import ChainProvider from '../src/contexts/chain';
import WalletProvider from '../src/contexts/wallet';
import GlobalStyle from '../src/styles/GlobalStyle';
import { useIsMobile } from '../src/utils/isMobile';

function App({ Component, pageProps }: AppProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <GlobalStyle />
      <ChainProvider>
        <WalletProvider>
          <Page>
            <Header />
            <Spacer height={isMobile ? 32 : 16} />
            <Component {...pageProps} />
          </Page>
        </WalletProvider>
      </ChainProvider>
    </>
  );
}

export default App;
