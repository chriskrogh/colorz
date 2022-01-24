import React from 'react';
import styled from 'styled-components';

import Column from '../Column';
import Spacer from '../Spacer';
import Typography from '../Typography';

const COLOR_SIZE = 64;

type ColorProps = {
  color: string;
};
const Color = styled.div.attrs<ColorProps>(({ color }) => ({
  style: {
    backgroundColor: color,
  },
}))`
  width: ${COLOR_SIZE}px;
  height: ${COLOR_SIZE}px;
  border-radius: 50%;
  margin: 16px;
`;

type Props = ColorProps;

const ColorListItem: React.FC<Props> = ({ color }) => {
  return (
    <Column alignItems="center">
      <Color color={color} />
      <Spacer height={4} />
      <Typography as="p">{color}</Typography>
    </Column>
  );
};

export default ColorListItem;
