import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Flexbox } from '../../UI-Components';

const { spacing, colors, fontSize, fontWeights, screens } = theme;


export const AddressSearchWrapper = styled(Flexbox)`
  > *:first-child {
    flex-grow: 1;
  }
  > *:last-child {
    margin: ${spacing[4]} 0 0;
  }
`;
export const Label = styled.p`
  font-weight: ${fontWeights['bold']};
  font-size: ${fontSize['sm']};
  margin-bottom: ${spacing[2]};
  :after {
    content: ' *';
    color: ${colors['primary'][100]};
  }
`;

export const StackableWrapper = styled(Flexbox)`
  justify-content: left;
  align-items: flex-start;
  flex-wrap: wrap;

  > div {
    width: 100%;
  }

  @media (min-width: ${screens.sm}) {
    flex-wrap: nowrap;
    > div {
      box-sizing: border-box;
      padding: 0 ${spacing[1]};
      flex-grow: 1;
    }
    label {
      white-space: nowrap;
    }
  }

  @media (min-width: ${screens.md}) {
    > div:first-child {
      padding-left: 0;
    }
    > div:last-child {
      padding-right: 0;
    }
  }
`;
