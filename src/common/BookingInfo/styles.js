import styled, { css } from 'styled-components';
import { Container, Flexbox } from '../../UI-Components';

export const JustifiedWrapper = styled(Flexbox)`
  justify-content: space-between;
`;

export const BookingInfoWrapper = styled(Container)`
  display: table;
  ${({ centered }) =>
    centered &&
    css`
      margin-left: auto;
      margin-right: auto;
    `}
`;
