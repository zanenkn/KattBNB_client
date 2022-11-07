import { ContentWrapper } from '../../UI-Components';
import styled from 'styled-components';

const StyledContentWrapper = styled(ContentWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  > *:last-child {
    margin-bottom: auto;
  }
`

const CssSpinner = () => {
  return (
    <div className='lds-spinner'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

const Spinner = ({ page }) => {
  if (page) {
    return <StyledContentWrapper><CssSpinner/></StyledContentWrapper>;
  } else {
    return <CssSpinner />;
  }
};

export default Spinner;
