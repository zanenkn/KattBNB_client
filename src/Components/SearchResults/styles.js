import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container, Flexbox, ContentWrapper } from '../../UI-Components';

const { spacing, colors } = theme;

export const SearchCriteriaWrapper = styled(Container)`
  display: table;
  margin: auto;
`;

export const UtilWrapper = styled(Flexbox)`
  justify-content: space-between;
`;

export const RoundButton = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  height: ${spacing[6]};
  width: ${spacing[6]};
  border-radius: 50%;
  background-color: ${({ active }) => (active ? colors['primary'][100] : colors['neutral'][60])};
  margin-right: ${spacing[2]};
  cursor: pointer;
  > svg {
    fill: ${colors['white'][100]}
  }
`;

export const SearchResultWrapper = styled(ContentWrapper)`
  padding-top: ${({ padding }) => padding}px;
`;

export const MapWrapper = styled.div`
  padding-top: 225px;
  height: calc(var(--vh, 1vh) * 100 - 225px);
  width: 100%;
`