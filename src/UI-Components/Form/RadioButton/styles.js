import styled, { keyframes } from 'styled-components';
import { Text } from '../..';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

export const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
  position: absolute;
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5) ;
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) ;
  }
`;

export const Label = styled.label`
  display: flex;
  flex-direction: row-reverse;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-bottom: ${spacing[4]};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const LabelText = styled(Text)`
  color: ${({ checked }) => (checked ? colors.neutral[100] : colors.neutral[60])};
  margin-bottom: 0;
`;

export const Indicator = styled.div`
  border: 1px solid ${colors.neutral[100]};
  border-radius: 50%;
  min-width: 12px;
  height: 12px;
  position: relative;
  margin: 0.25rem 0.5rem 0 0;

  ${Label}:hover & {
    background: ${colors.neutral[20]};
  }

  &::after {
    content: '';
    display: none;
  }

  ${Input}:checked + &::after {
    display: block;
    border-radius: 50%;
    background-color: ${colors.primary[100]};
    width: 6px;
    height: 6px;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    animation-name: ${popIn};
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }

  ${Input}:disabled + & {
    pointer-events: none;
    opacity: 0.6;
    background: #e6e6e6;
  }
`;
