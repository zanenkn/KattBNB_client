import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;
const padV = 16;
const padH = 16;
const labelSize = 14;

export const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${colors.neutral[100]};
  margin-bottom: ${({ space }) => spacing[space]};
  position: relative;
`;

export const Label = styled.label`
  color: ${colors.neutral[60]};
  font-size: ${labelSize}px;
  font-style: italic;
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.06, 0.67, 0.32, 0.82);
  transform: translate(${padH}px, ${1.333 * labelSize + padV}px);
  ${({ up, required }) =>
    up &&
    css`
      color: ${colors.neutral[100]};
      transform: scale(1) translate(-2px, -2px);
      font-weight: 700;
      font-style: normal;
      ${required &&
      `::after { 
          content: " *";
          color: ${colors.primary[100]}
        }`}
    `}
`;

export const TextBox = styled.textarea`
  background-color: transparent;
  box-sizing: border-box;
  color: inherit;
  outline: none;
  border-radius: 3px;
  font-size: 16px;
  width: 100%;
  max-width: 100%;
  min-height: 150px;
  padding: ${padV}px ${padH}px;
  border: 1px solid ${colors.neutral[60]};
  &:focus {
    border: 1px solid ${colors.neutral[100]};
  }
  &:-internal-autofill-selected {
    background-color: transparent;
  }
`;

export const RequiredLabel = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: 36px;
  right: 10px;
  border-radius: 9999px;
  background-color: ${colors.primary[100]};
  opacity: 1;
  transition: all 0.5s ease;
  ${({ focused }) =>
    focused &&
    css`
      opacity: 0;
    `}
`;
