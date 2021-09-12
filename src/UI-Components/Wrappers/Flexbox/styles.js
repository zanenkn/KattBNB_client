import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing } = theme;

export const StyledFlexbox = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin-bottom: ${({ space }) => spacing[space]};
  > *:last-child {
    margin-bottom: 0;
  }

  ${({ direction, verticalAlign }) => {
    if (direction === 'row') {
      switch (verticalAlign) {
        case 'top':
          return css`
            align-items: start;
          `;
        case 'bottom':
          return css`
            align-items: end;
          `;
        default:
          return css`
            align-items: center;
          `;
      }
    }
    if (direction === 'column') {
      switch (verticalAlign) {
        case 'top':
          return css`
            justify-content: start;
          `;
        case 'bottom':
          return css`
            justify-content: end;
          `;
        default:
          return css`
            justify-content: center;
          `;
      }
    }
  }}

  ${({ direction, horizontalAlign }) => {
    if (direction === 'row') {
      switch (horizontalAlign) {
        case 'right':
          return css`
            justify-content: end;
          `;
        case 'left':
          return css`
            justify-content: start;
          `;
        default:
          return css`
            justify-content: center;
          `;
      }
    }
    if (direction === 'column') {
      switch (horizontalAlign) {
        case 'right':
          return css`
            align-items: end;
          `;
        case 'left':
          return css`
            align-items: start;
          `;
        default:
          return css`
            align-items: center;
          `;
      }
    }
  }}
`;
