import styled, { css } from 'styled-components';

type Props = {
  underline?: boolean;
  center?: boolean;
  secondary?: boolean;
  bold?: boolean;
};

const Typography = styled.span<Props>`
  color: ${({ color, secondary }) =>
    secondary ? 'rgba(255, 255, 255, 0.5)' : color ? color : 'black'};
  margin: 0;
  border-bottom: ${({ underline }) => (underline ? '1px solid black' : '')};
  text-align: ${({ center }) => (center ? 'center' : '')};
  ${({ bold }) =>
    bold
      ? css`
          font-weight: bold;
        `
      : ''};
`;

export default Typography;
