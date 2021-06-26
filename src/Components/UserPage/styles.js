import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container } from '../../UI-Components';

const { spacing, colors } = theme;

export const FlexWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ centered }) => centered && 'justify-content: center'};

  > * {
    margin-bottom: 0;
    margin-right: ${({ spaceBetween }) => spacing[spaceBetween]};
  }

  > *:last-child {
    margin-right: 0;
  }
`;

export const UpdateFormWrapper = styled.div`
  max-height: ${({ open }) => (open ? '1000px' : '0px')};
  height: auto;
  overflow: hidden;
  transition: max-height 1s ease-in-out;
  width: 200px;
  margin: auto;
`;

export const MaxWidth = styled.div`
  max-width: 300px;
  margin: 0 auto ${spacing[8]};
  > *:last-child {
    margin-right: 0;
  }
`;

export const SettingsWrapper = styled.div`
  width: max-content;
  margin: auto;
`;

export const AvatarEditBtnWrapper = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  background-color: ${colors.primary[100]};
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  left: calc(50% + 35px);
  bottom: 10px;
`;

export const AvatarUpdateFormWrapper = styled(Container)`
  position: relative;
`;

export const WithCursorPointer = styled(Container)`
  cursor: pointer;
`;

export const ButtonWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  > * {
    margin-right: 1rem;
    margin-bottom: 0;
  }
  > *:last-child {
    margin-right: 0;
  }
`
