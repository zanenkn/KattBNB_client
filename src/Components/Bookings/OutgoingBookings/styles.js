import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing, screens, colors, fontWeights } = theme;


export const SecondaryStickyHeader = styled.div`
height: 150px; 
margin: 0;
padding: 1rem 2rem;
position: fixed;
background: white;
width: 100%;
z-index: 100;
box-shadow: 0 0 20px -5px rgba(0,0,0,.2);
`