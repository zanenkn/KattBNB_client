import styled from 'styled-components';

export const ReversibleWrapper = styled.div`
  display: flex;
  flex-direction: ${({ revert }) => (revert ? 'column-reverse' : 'column')};
  align-items: center;
`;
