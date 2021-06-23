import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ centered }) => centered && 'justify-content: center'};
  margin-bottom: ${spacing[4]};

  > * {
    margin-bottom: 0;
    margin-right: ${spacing[2]};
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
