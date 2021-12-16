import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container, Flexbox } from '../../UI-Components';

const { spacing, colors, screens, navbar } = theme;

export const SearchCriteriaWrapper = styled(Container)`
  display: table;
  margin: auto;
`;

export const JustifiedWrapper = styled(Flexbox)`
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
  background-color: ${({ active }) => (active ? colors['info'][100] : colors['neutral'][60])};
  margin-right: ${spacing[2]};
  cursor: pointer;
  > svg {
    fill: ${colors['white'][100]};
  }
`;

export const SearchResultWrapper = styled.div`
  padding-top: ${({ padding }) => `calc(${padding}px + ${navbar.sm})`};
  height: ${({ padding }) => `calc(var(--vh, 1vh) * 100 - ${padding}px - ${navbar.sm})`};

  @media (min-height: ${screens.md}) {
    padding-top: ${({ padding }) => `calc(${padding}px + ${navbar.md})`};
    height: ${({ padding }) => `calc(var(--vh, 1vh) * 100 - ${padding}px - ${navbar.md})`};
  }
  @media (min-height: ${screens.lg}) {
    padding-top: ${({ padding }) => `calc(${padding}px + ${navbar.lg})`};
    height: ${({ padding }) => `calc(var(--vh, 1vh) * 100 - ${padding}px - ${navbar.lg})`};
  }

  width: 100%;
`;

export const Badge = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${({ nature }) => (nature === 'availability' ? colors['success'][100] : colors['neutral'][60])};
  position: absolute;
  top: -1px;
  right: -1px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
  display: flex;
  flex-direction: column;
  align-items: end;
  padding: 20px 20px 0 0;
`;

export const BackLinkWrapper = styled.div`
  margin-left: ${spacing[4]};
`;
