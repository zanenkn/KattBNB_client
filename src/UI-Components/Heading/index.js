import styled from 'styled-components';

const StyledHeading = styled.h1`
  color: ${props => props.color || props.theme.colors.base};
`;

const Heading = ({ level, color, ...rest }) => {
  return (
    <StyledHeading
      as={`h${level}`}
      color={color}
      {...rest}
    />
  )
};

Heading.defaultProps = {
  level: 1
};

export default Heading;