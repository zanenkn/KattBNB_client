import styled from 'styled-components';
import { Container } from '../../../UI-Components';

export const FlexWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:first-child {
    margin-right: 0.5rem;
  }

  > *:last-child {
    margin-bottom: 0rem;
  }
`;
