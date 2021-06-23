import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${({ space }) => spacing[space]};
`;

export const CloseOnOutsideElementClickEnabler = styled.div`
  display: ${({ isOn }) => (isOn ? 'block' : 'none')};
  width: 200vw;
  height: 200vh;
  backgroundcolor: transparent;
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
`;

export const InputIcon = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 32px;
  width: 32px;
`;

export const DropdownContainer = styled.ul`
  background: #fff;
  padding: 8px 0;
  list-style-type: none;
  min-width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid ${colors.neutral[60]};
  border-radius: 3px;
  border-top: none;
  margin: 0;
  box-sizing: border-box;
  max-height: 280px;
  overflow-y: auto;
  z-index: 1;
`;

export const DropdownOption = styled.li`
  padding: 0 24px;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    background-color: ${colors.neutral[10]};
  }
`;

export const DropdownOptionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  line-height: 32px;
  text-align: left;
  &:active {
    outline: none;
    color: #0076f5;
  }
`;
export const Input = styled.input`
  background-color: transparent;
  box-sizing: border-box;
  color: inherit;
  outline: none;
  border-radius: 3px;
  font-size: 16px;
  width: 100%;
  padding: 16px;
  border: 1px solid ${colors.neutral[60]};
  &:focus {
    border: 1px solid ${colors.neutral[100]};
    + ${InputIcon} {
      transform: rotate(90deg);
    }
  }
`;
