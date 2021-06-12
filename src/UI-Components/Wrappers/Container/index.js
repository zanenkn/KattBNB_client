import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const Styled = styled.div`
  margin-bottom: ${(props) => theme.spacing[props.space]};
`;

const Container = ({ space, ...rest }) => {
  return <Styled space={space} {...rest} />;
};

Container.defaultProps = {
  space: 4,
};

export default Container;
