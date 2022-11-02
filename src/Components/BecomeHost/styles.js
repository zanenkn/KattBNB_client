import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { ContentWrapper } from '../../UI-Components';

const { screens, spacing } = theme;

export const StyledContentWrapper = styled(ContentWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const VideoWrapper = styled.div`
  position: relative; 
  margin: 0 auto;
  padding-top: ${spacing[4]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: max-content;
  width: 100%;

  @media screen and (min-width: 425px) {
    width: 425px;
    padding-top: ${spacing[8]};
  }
  @media screen and (min-width: ${screens['lg']}) {
    width: 450px;
  }
`;
