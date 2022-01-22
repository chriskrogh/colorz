import type { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';

import Button from '../../src/components/Button';
import Column from '../../src/components/Column';
import Loader from '../../src/components/Loader';
import Row from '../../src/components/Row';
import Spacer from '../../src/components/Spacer';
import Typography from '../../src/components/Typography';
import { useColorContract } from '../../src/hooks/useColorContract';
import { colors } from './colors';

const COLOR_SIZE = 64;

const Container = styled(Column)`
  flex: 1 1 auto;
  padding: 0 16px;
`;

const ColorContainer = styled(Row)`
  flex-wrap: wrap;
`;

const Color = styled.div.attrs(({ color }) => ({
  style: {
    backgroundColor: color,
  },
}))`
  width: ${COLOR_SIZE}px;
  height: ${COLOR_SIZE}px;
  border-radius: 50%;
  margin: 16px;
`;

const Desktop: NextPage = () => {
  const { requestColors, loading } = useColorContract();

  return (
    <Container alignItems="center">
      <Row justifyContent="space-between" alignItems="center" fullWidth>
        <Typography as="h4">Your colors</Typography>
        {loading ? <Loader /> : <Button onClick={requestColors}>Mint</Button>}
      </Row>
      <Spacer height={24} />
      <ColorContainer alignItems="center" fullWidth>
        {colors.map((color, index) => (
          <Column key={index} alignItems="center">
            <Color color={color} />
            <Spacer height={4} />
            <Typography as="p">{color}</Typography>
          </Column>
        ))}
      </ColorContainer>
    </Container>
  );
};

export default Desktop;
