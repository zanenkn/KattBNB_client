import { CurrentPageNumber, NavigationWrapper } from './styles';
import { Link } from 'react-router-dom';

const Navigation = ({ currentPage, total }) => {
  return (
    <NavigationWrapper>
      {currentPage > 1 && <Link to={`/blog/all/${currentPage - 1}`}>prev</Link>}
      <CurrentPageNumber>{currentPage}</CurrentPageNumber>
      {currentPage < total && <Link to={`/blog/all/${currentPage + 1}`}>next</Link>}
    </NavigationWrapper>
  );
};

export default Navigation;
