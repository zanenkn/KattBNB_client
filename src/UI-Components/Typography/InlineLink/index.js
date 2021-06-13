import styled from 'styled-components';

const Styled = styled.a`
  color: ${(props) => props.theme.colors.main};
  font-weight: 700;
  &:hover {
    color: ${(props) => props.theme.colors.mainDarker};
    text-decoration: underline;
  }
`;

const InlineLink = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default InlineLink;
