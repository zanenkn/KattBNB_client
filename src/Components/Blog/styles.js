import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container } from '../../UI-Components';

const { spacing } = theme;

export const PostWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  margin-bottom: 1rem;
  object-fit: cover;
  @media screen and (min-width: 640px) {
    width: 200px;
    height: 200px;
    margin: 0 ${spacing[6]} 0 0;
  }
`;
