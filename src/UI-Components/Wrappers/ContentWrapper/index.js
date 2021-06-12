import styled from 'styled-components';

const Styled = styled.div`
  @media screen and (max-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  margin: 0 auto;
  padding-top: 5vw;
  padding-bottom: 5vw;
  max-width: 768px;
  min-height: calc(var(--vh, 1vh) * 100 - 60px);
  position: relative;
  margin-top: 60px;

  @media screen and (min-height: 736px) {
    min-height: calc(var(--vh, 1vh) * 100 - 75px);
    margin-top: 75px;
  }
  @media screen and (min-height: 1024px) {
    min-height: calc(var(--vh, 1vh) * 100 - 90px);
    margin-top: 90px;
  }
`;

const ContentWrapper = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default ContentWrapper;
