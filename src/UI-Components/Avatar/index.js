import styled from 'styled-components';

const Styled = styled.img`
  border-radius: 99999px;
  width: 150px;
  height: 150px;
  display: block;
  margin: auto;
`;

const Avatar = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default Avatar;
