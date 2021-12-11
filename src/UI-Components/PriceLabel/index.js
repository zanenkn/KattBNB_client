import { StyledPriceLabel } from "./styles";

const PriceLabel = ({ color, ...rest }) => {
  return <StyledPriceLabel color={color} {...rest} />;
};

export default PriceLabel;
