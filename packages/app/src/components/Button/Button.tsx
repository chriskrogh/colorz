import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../utils/colors';
import Typography from '../Typography';

type ContainerProps = {
  fullWidth?: boolean;
  secondary?: boolean;
};
const Container = styled.button<ContainerProps>`
  border: none;
  margin: 0;
  padding: 8px 16px;
  background-color: ${({ secondary }) =>
    secondary ? 'rgba(0, 0, 0, 0.12)' : COLORS.primary};
  border-radius: 8px;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  ContainerProps & {
    children: string;
  };

const Button: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Container {...props}>
      <Typography as="p" secondary={props.disabled} color="white" bold>
        {children}
      </Typography>
    </Container>
  );
};

export default Button;
