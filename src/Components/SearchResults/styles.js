import styled, { css } from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container, Flexbox } from '../../UI-Components';

const { spacing, colors, screens, navbar, fontSize, fontWeights } = theme;

export const SearchCriteriaWrapper = styled(Container)`
  display: table;
  margin: auto;
  margin-bottom: ${({ space }) => (space ? spacing[space] : '0')};
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
  background-color: ${({ background }) => (background ? colors[background][20] : colors[['white']][100])};
  padding-top: ${({ padding }) => `calc(${padding}px + ${navbar.sm})`};

  ${({ map }) => (map ? 'height' : 'min-height')}: ${({ padding }) =>
    `calc(var(--vh, 1vh) * 100 - ${padding}px - ${navbar.sm})`};

  @media (min-height: ${screens.md}) {
    padding-top: ${({ padding }) => `calc(${padding}px + ${navbar.md})`};
    ${({ map }) => (map ? 'height' : 'min-height')}: ${({ padding }) =>
      `calc(var(--vh, 1vh) * 100 - ${padding}px - ${navbar.md})`};
  }
  @media (min-height: ${screens.lg}) {
    padding-top: ${({ padding }) => `calc(${padding}px + ${navbar.lg})`};
    ${({ map }) => (map ? 'height' : 'min-height')}: ${({ padding }) =>
      `calc(var(--vh, 1vh) * 100 - ${padding}px - ${navbar.lg})`};
  }

  width: 100%;
`;

export const Badge = styled.div`
  ${({ responsive }) =>
    responsive &&
    css`
      @media (max-width: ${screens.md}) {
        width: 70px;
        height: 70px;
        padding: ${spacing[3]} ${spacing[3]} 0 0;
        > svg {
          height: 1.5rem;
        }
      }
    `}
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
  padding: ${spacing[5]} ${spacing[5]} 0 0;
`;

export const BackLinkWrapper = styled.div`
  margin-left: ${spacing[4]};
`;

export const InnerResultWrapper = styled.div`
  padding: ${spacing[6]} ${spacing[4]};
  max-width: 560px;
  margin: auto;

  @media (min-width: ${screens.md}) {
    padding: ${spacing[6]};
  }
`;
export const ListItem = styled(Container)`
  cursor: pointer;
  background-color: ${colors['white'][100]};
  padding: ${spacing[5]} ${spacing[4]};
  @media (min-width: ${screens.md}) {
    padding: ${spacing[6]};
  }
  margin: 0 auto ${spacing[5]};
  max-width: 400px;
  position: relative;
`;

export const DatapointCounter = styled.div`
  width: ${(pointCount, pointLength, expandable) => (expandable ? 10 + (pointCount / pointLength) * 20 : '25')}px;
  height: ${(pointCount, pointLength, expandable) => (expandable ? 10 + (pointCount / pointLength) * 20 : '25')}px;
  color: ${colors['white'][100]};
  background-color: ${({ available }) => (available ? colors['success'][100] : colors['neutral'][80])};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize['sm']};
  font-weight: ${fontWeights['bold']};
  border-radius: 50px;
  ${({ expandable }) =>
    expandable
      ? css`
          transform: translate(-50%, -50%);
          position: absolute;
        `
      : css`
          margin-left: 0.25rem;
        `}
`;

export const MarkerWrapper = styled.div`
  ${({ cluster }) => css`
    transform: ${cluster ? 'translate(calc(-50% + 15px), calc(-50% - 15px))' : 'translate(-50%, calc(-50% - 15px))}'};
    position: absolute;
    display: ${cluster ? 'flex' : 'block'};
  `}
`;
