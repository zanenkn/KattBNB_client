import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing, screens, colors, fontWeights } = theme;

const PrismicRichText = styled.div`
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

  > ul {
    margin-bottom: ${spacing[4]};
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
  h1, h2, h3, h4, h5 {
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  h1 {
    color: ${colors.primary[100]};
    font-size: 1.802rem;
  }
  
  h2 {
    margin-top: ${spacing[6]};
    color: ${colors.primary[100]};
    font-size: 1.602rem;
  }
  
  h3 {
    margin-top: ${spacing[6]};
    color: ${colors.neutral[100]};
    font-size: 1.424rem;
  }
  
  h4 {
    color: ${colors.neutral[100]};
    font-size: 1.266rem;
  }
  
  h5 {
    color: ${colors.neutral[100]};
    font-size: 1.125rem;
  }

  @media (min-width: ${screens.md}) {
    h1 {
      font-size: 2.488rem;
    }
    h2 {
      font-size: 2.074rem;
    }
    h3 {
      font-size: 1.728rem;
    }
    h4 {
      font-size: 1.44rem;
    }
    h5 {
      font-size: 1.2rem;
    }
  }
`;

export default PrismicRichText;
