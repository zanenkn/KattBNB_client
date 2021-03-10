import styled from 'styled-components';

export const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4rem;

  @media (min-width: 640px) {
    flex-direction: row;
    margin-bottom: 3rem;
    align-items: center;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    width: 200px;
    height: 200px;
    margin: 0 2rem 0 0;
  }
`;
