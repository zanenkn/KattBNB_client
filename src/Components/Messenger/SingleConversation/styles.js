import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import { ContentWrapper, SecondaryStickyHeader } from '../../../UI-Components';

const { spacing, screens, colors, navbar } = theme;

export const StickyFooter = styled.div`
  min-height: 80px;
  width: 100%;
  position: sticky;
  left: 0;
  bottom: 0;
  background: white;
  z-index: 100;
  box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.2);
  padding: 1rem 0;
  box-sizing: border-box;
`;

export const MaxWidh = styled.div`
  box-sizing: border-box;
  max-width: ${screens['md']};
  margin: auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-right: ${() => spacing[6]};
  padding-left: ${() => spacing[6]};

  @media screen and (min-width: ${screens.sm}) {
    padding-left: ${spacing[6]};
    padding-right: ${spacing[6]};
  }

  @media screen and (min-width: ${screens.md}) {
    padding-left: ${spacing[10]};
    padding-right: ${spacing[10]};
  }

  > *:not(textarea) {
    cursor: pointer;
  }
}
`;

export const Inner = styled(MaxWidh)`
  align-items: end;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    padding: 11px 0 11px 11px;
    cursor: pointer;
  }
`;

export const Message = styled.div`
  background-color: ${({ belongsToCurrent }) => (belongsToCurrent ? colors.info[110] : colors.neutral[60])};
  color: white;
  margin: ${({ belongsToCurrent }) => (belongsToCurrent ? 'auto 0 auto auto' : '0')};
  border-radius: ${({ belongsToCurrent }) => (belongsToCurrent ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0')};
  ${({ isImage }) =>
    isImage &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    `}
  padding: ${({ isImage }) => (isImage ? 'none' : '1rem')};
  height: min-content;
  width: fit-content;
  max-width: 70%;
  text-align: ${({ belongsToCurrent }) => (belongsToCurrent ? 'right' : 'left')};
  overflow-wrap: break-word;
`;

export const StyledContentWrapper = styled(ContentWrapper)`
  min-height: calc(var(--vh, 1vh) * 100 - ${navbar.sm} - 88px);
  padding-top: calc(${navbar.sm} + ${spacing[5]});

  @media screen and (min-height: ${screens.md}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.md} - 88px);
    padding-top: calc(${navbar.md} + ${spacing[5]});
  }
  @media screen and (min-height: ${screens.lg}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.lg} - 88px);
    padding-top: calc(${navbar.lg} + ${spacing[5]});
  }

  @media screen and (min-width: ${screens.sm}) {
    padding-left: ${spacing[6]};
    padding-right: ${spacing[6]};
  }

  @media screen and (min-width: ${screens.md}) {
    padding-left: ${spacing[10]};
    padding-right: ${spacing[10]};
  }
`;

export const StyledSecondaryStickyHeader = styled(SecondaryStickyHeader)`
  padding: 0;

  height: ${navbar.sm};
  @media (min-height: ${screens.md}) {
    height: ${navbar.md};
  }
  @media (min-height: ${screens.lg}) {
    height: ${navbar.lg};
  }
`;
