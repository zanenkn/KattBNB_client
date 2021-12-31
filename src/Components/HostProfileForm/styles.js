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
  justify-content: space-between;
  align-items: flex-start;

  > div {
    width: 100%;
  }

  @media (min-width: ${screens.md}) {
    > div {
      box-sizing: border-box;
      padding: 0 ${spacing[2]};
      max-width: 33%;
    }
    > div:first-child {
      padding-left: 0;
    }
    > div:last-child {
      padding-right: 0;
    }
  }
`;