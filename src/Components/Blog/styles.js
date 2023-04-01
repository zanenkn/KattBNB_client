import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container } from '../../UI-Components';

const { spacing, screens, colors, fontWeights } = theme;

export const PostWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${screens.md}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  margin-bottom: ${spacing[4]};
  object-fit: cover;
  @media screen and (min-width: ${screens.md}) {
    width: 200px;
    height: 200px;
    margin: 0 ${spacing[6]} 0 0;
  }
`;

export const FeaturedImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  @media screen and (min-width: ${screens.md}) {
    max-height: 400px;
  }
  margin-bottom: ${spacing[5]};
`;

export const FlexWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const AuthorAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: ${spacing[2]};
`;
