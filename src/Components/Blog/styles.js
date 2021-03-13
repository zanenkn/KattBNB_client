import styled from 'styled-components';

export const PostWrapper = styled.div`
  display: flex !important;
  flex-direction: column !important;
  margin-bottom: 4rem !important;

  @media (min-width: 640px) {
    flex-direction: row !important;
    margin-bottom: 3rem !important;
    align-items: center !important;
  }
`;

export const PostImage = styled.img`
  width: 100% !important;
  margin-bottom: 1rem !important;

  @media (min-width: 640px) {
    width: 200px !important;
    height: 200px !important;
    margin: 0 2rem 0 0 !important;
  }
`;

export const FeaturedImage = styled.img`
  width: 100% !important;
  max-height: 300px !important;
  object-fit: cover !important;
  @media (min-width: 640px) {
    max-height: 400px !important;
  }
  margin-bottom: 2rem !important;
`;

export const Divider = styled.hr`
  width: 100% !important;
  border: solid 0.25pt silver !important;
  width: 100% !important;
  margin: 3rem auto !important;
`;

export const AuthorAvatar = styled.img`
  width: 30px !important;
  height: 30px !important;
  border-radius: 9999px !important;
  margin-right: 0.5rem !important;
`;

export const Flex = styled.div`
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  margin: 0.5rem auto 4rem !important;
  & > p {
    margin: 0 !important;
  }
`;
