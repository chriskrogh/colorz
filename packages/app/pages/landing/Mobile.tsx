import type { NextPage } from 'next';
import styled from 'styled-components';

import Button from '../../src/components/Button';
import Column from '../../src/components/Column';
import Row from '../../src/components/Row';
import Spacer from '../../src/components/Spacer';
import Typography from '../../src/components/Typography';

const Container = styled(Column)`
  flex: 1 1 auto;
  padding: 0 16px;
`;

const Mobile: NextPage = () => {
  return (
    <Container alignItems="center">
      <Row justifyContent="space-between" alignItems="center" fullWidth>
        <Typography as="h3">Your colors</Typography>
        <Button>Mint</Button>
      </Row>
      <Spacer height={32} />
    </Container>
  );
};

export default Mobile;
