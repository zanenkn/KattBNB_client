import styled from 'styled-components';

export const FlexWrapper = styled.div`
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
