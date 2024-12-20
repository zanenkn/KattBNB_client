import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Container, ContentWrapper, SecondaryStickyHeader } from '../../../UI-Components';

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
  padding: ${spacing[4]} 0;
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
  border-radius: ${({ belongsToCurrent }) =>
    belongsToCurrent ? `${spacing[4]} ${spacing[4]} 0 ${spacing[4]}` : `${spacing[4]} ${spacing[4]} ${spacing[4]} 0`};
  ${({ isImage }) =>
    isImage &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    `}
  padding: ${({ isImage }) => (isImage ? 'none' : `${spacing[4]}`)};
  height: min-content;
  width: fit-content;
  max-width: 70%;
  text-align: ${({ belongsToCurrent }) => (belongsToCurrent ? 'right' : 'left')};
  overflow-wrap: break-word;
`;

export const ConversationWrapper = styled(ContentWrapper)`
  padding-top: calc(${navbar.sm});
  min-height: unset;

  @media screen and (min-height: ${screens.md}) {
    padding-top: calc(${navbar.md});
  }
  @media screen and (min-height: ${screens.lg}) {
    padding-top: calc(${navbar.lg});
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
export const AllConversationsWrapper = styled(ConversationWrapper)`
  padding-left: 0;
  padding-right: 0;
  min-height: calc(var(--vh, 1vh) * 100 - ${navbar.sm});

  @media screen and (min-height: ${screens.md}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.md});
  }
  @media screen and (min-height: ${screens.lg}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.lg});
  }
`;

export const MessagesWrapper = styled.div`
  min-height: calc(var(--vh, 1vh) * 100 - ${navbar.sm}*2 - 88px);
  padding-top: ${spacing[5]};
  box-sizing: border-box;

  @media screen and (min-height: ${screens.md}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.md}*2 - 88px);
  }
  @media screen and (min-height: ${screens.lg}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.lg}*2 - 88px);
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

export const ImageUploadArea = styled(Container)`
  background-color: ${colors['neutral'][10]};
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C5C3C8FF' stroke-width='9' stroke-dasharray='6%2c25' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

  & label {
    display: block;
    padding: ${spacing[6]};
    cursor: pointer;
  }
  & input[type='file'] {
    display: none;
  }
`;

export const ImagePreview = styled(Container)`
  position: relative;
`;

export const RoundButton = styled.div`
  cursor: pointer;
  position: absolute;
  right: -${spacing[3]};
  top: -${spacing[3]};
  height: ${spacing[6]};
  background: ${colors['primary'][100]};
  border-radius: 50%;
  width: ${spacing[6]};
  height: ${spacing[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
