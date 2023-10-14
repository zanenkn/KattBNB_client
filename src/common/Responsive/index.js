import useCurrentScope from '../../hooks/useCurrentScope';

const Responsive = ({ displayIn, children }) => {
  const {
    device: { type },
  } = useCurrentScope();
  return <>{displayIn.includes(type) ? children : null}</>;
};

export default Responsive;
