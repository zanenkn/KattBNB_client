import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { colors } = theme;

export const StyledPriceLabel = styled.div`
  background-color: ${({color}) => colors[color][100]};

    color: ${colors['white'][100]};
  

`