
import styled from 'styled-components'

export const MenuWrapper = styled.div `
  display: ${props => props.visible ? 'flex': 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 0;
  position: absolute;
  width: 100%;
  z-index: 99999;
  background-color: silver;
  top: 60px;
  height: calc(var(--vh, 1vh) * 100 - 60px);
  @media (min-height: 736px) {
    top: 75px;
    height: calc(var(--vh, 1vh) * 100 - 75px);
  }
  @media (min-height: 1024px) {
    top: 90px;
    height: calc(var(--vh, 1vh) * 100 - 90px);
  }
`

export const MenuLink = styled.div `
  color: #c90c61;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
`