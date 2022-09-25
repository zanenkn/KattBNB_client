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

export const PrismicRichText = styled.div`
  margin-bottom: ${spacing[10]};

  > .block-img {
    display: flex;
  }

  > .block-img > img {
    width: 100%;
    height: 100%;
    max-width: 400px;
    margin: ${spacing[4]} auto;
  }

  > p {
    margin-bottom: ${spacing[4]};
    line-height: 150%;
  }

  > p > a {
    color: ${colors.info[100]};
    font-weight: ${fontWeights.bold};
    cursor: pointer;
    &:hover {
      color: ${colors.info[110]};
      text-decoration: underline;
    }
  }
`;

export const ShareIcons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > a {
    margin-right: ${spacing[3]};
  }
`;