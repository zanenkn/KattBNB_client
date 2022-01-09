import { theme } from '../Styles/theme';

const { colors } = theme;

export const getAvatar = (name = '[x]') => {
  return `https://ui-avatars.com/api/?name=${name}&size=150&length=3&font-size=0.3&rounded=true&background=${colors.neutral[20].substring(
    1
  )}&color=${colors.primary[100].substring(1)}&uppercase=false`;
};
