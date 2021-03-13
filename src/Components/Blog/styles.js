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

export const FeaturedImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  @media (min-width: 640px) {
    max-height: 400px;
  }
  margin-bottom: 2rem;
`;

export const Divider = styled.hr`
  width: 100%;
  border: solid 0.25pt silver;
  width: 100%;
  margin: 3rem auto;
`;

export const AuthorAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  margin-right: 0.5rem;
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem auto 4rem;
  & > p {
    margin: 0;
  }
`;
