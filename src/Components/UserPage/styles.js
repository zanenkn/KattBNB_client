import styled from 'styled-components';

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > *:first-child {
    margin-right: 0.25rem;
  }

  > *:last-child {
    margin-bottom: 0rem;
  }
`;
