import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Avatar } from '../../../UI-Components';

const { fontWeights, fontSize, colors, spacing } = theme;

export const ItemWrapper = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 0;
`;

export const MenuItem = styled.li`
  display: inline-block;
  margin-left: ${({ icon }) => (icon ? spacing[7] : spacing[5])};
  margin-bottom: 0;
  position: relative;
  line-height: 0;

  &:hover > ul {
    opacity: ${({ showSubmenus }) => (showSubmenus ? '1' : '0')};
    visibility: ${({ showSubmenus }) => (showSubmenus ? 'visible' : 'hidden')};
  }

  > p,
  a {
    padding: 10px;
    margin: 0;
    color: ${colors.white[100]};
    font-weight: ${fontWeights.bold};
    display: inline-block;
  }

  > a:hover {
    text-decoration: none;
    color: ${colors.white[100]};
  }

  > svg {
    padding: 4px 0;
  }
`;

export const Submenu = styled.ul`
  padding-inline-start: 0;
  list-style: none;
  padding: ${spacing[4]} ${spacing[5]};
  opacity: 0;
  visibility: hidden;
  background-color: ${colors.neutral[20]};
  text-align: left;
  position: absolute;
  top: 51px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  transition: all 0.2s ease-out 0.1s;
  border-radius: 15px;

  &:before {
    content: '';
    display: block;
    border-color: transparent transparent ${colors.neutral[20]} transparent;
    border-style: solid;
    border-width: 15px 20px 15px 20px;
    position: absolute;
    top: -25px;
    left: 50%;
    margin-left: -20px;
  }
`;

export const SubmenuItem = styled.li`
  margin-bottom: ${spacing[2]};
  &:last-child {
    margin-bottom: 0;
  }
  > a {
    color: ${colors.neutral[100]};
    font-size: ${fontSize.base};
    white-space: nowrap;
    padding: ${spacing[1]} 0;
    margin: 0;
  }

  > a:hover {
    text-decoration: none;
  }
`;
