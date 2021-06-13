import styled from 'styled-components';

const Styled = styled.a`
  color: ${({ theme: { colors } }) => colors.main};
  font-weight: ${({ theme: { fontWeights } }) => fontWeights.bold};
  &:hover {
    color: ${({ theme: { colors } }) => colors.mainDarker};
    text-decoration: underline;
  }
`;

const InlineLink = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default InlineLink;
