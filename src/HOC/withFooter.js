import { useEffect, useState } from 'react';
import Footer from '../Components/Footer';

const withFooter = (Component) => (props) => {
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    // TODO: this is probably a bad solution
    // look into programmatically checking if children have mounted
    const delayFooter = setTimeout(() => {
      setShowFooter(true);
    }, 1000);
    return () => clearTimeout(delayFooter);
  }, []);
  return (
    <>
      <Component {...props} />
      {showFooter && <Footer />}
    </>
  );
};

export default withFooter;
