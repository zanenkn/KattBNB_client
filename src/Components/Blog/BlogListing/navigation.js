import { CurrentPageNumber, NavigationWrapper } from './styles';
import { Link } from 'react-router-dom';
import { CheveronLeft, CheveronRight } from '../../../icons';

const Navigation = ({ currentPage, total }) => {
  return (
    <NavigationWrapper>
      {currentPage > 1 && (
        <Link to={`/blog/all/${currentPage - 1}`}>
          <CheveronLeft height={6} />
        </Link>
      )}
      <CurrentPageNumber bold>{currentPage}</CurrentPageNumber>
      {currentPage < total && (
        <Link to={`/blog/all/${currentPage + 1}`}>
          <CheveronRight height={6} />
        </Link>
      )}
    </NavigationWrapper>
  );
};

export default Navigation;
