import styled, { css } from 'styled-components';
import { theme } from '../../Styles/theme';
import { Flexbox, Text } from '../../UI-Components';

const { spacing, colors } = theme;

export const FlexWrapper = styled(Flexbox)`
  margin: ${({ margin }) => spacing[margin] || '1rem 0'};

  & > p {
    margin: 0 ${spacing[2]} 0 0;
  }
  & > div {
    display: flex;
    margin-right: 0.5rem;
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'unset')};
  }

  & > *:last-child {
    margin-right: 0;
  }
`;

export const Numerical = styled(Text)`
  ${({ required }) =>
    required &&
    css`
      ::after {
        content: ' *';
        color: ${colors.primary[100]};
      }
    `}
`;
