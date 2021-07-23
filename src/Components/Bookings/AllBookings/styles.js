import styled from 'styled-components';

export const BoxShadow = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, 0.2);

  @media screen and (min-width: 700px) {
    width: 560px;
    padding: 4rem;
  }
`;

export const TopBox = styled.div`
  padding: 1rem;
  padding-top: 2rem;
  background: #c90c61;

  @media screen and (max-width: 700px) {
    margin-bottom: 1rem;
    margin-top: -2rem;
    margin-left: -2rem;
    margin-right: -2rem;
  }

  @media screen and (min-width: 700px) {
    margin-bottom: 2rem;
    margin-top: -4rem;
    margin-left: -4rem;
    margin-right: -4rem;
  }
`;

export const ReversibleWrapper = styled.div`
  display: flex;
  flex-direction: ${({ revert }) => (revert ? 'column-reverse' : 'column')};
  align-items: center;
`;
