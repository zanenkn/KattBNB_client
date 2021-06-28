import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container } from '../../UI-Components';

const { spacing } = theme;

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
`;
