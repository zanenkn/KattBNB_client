import Footer from "../Components/Footer";

const withFooter = (Component) => (props) => {
  return (
    <>
      <Component {...props} />
      <Footer />
    </>
  );
};

export default withFooter
