import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Flexbox } from '../../../UI-Components';

const { spacing, colors, screens, fontSize } = theme;

export const RowWrapper = styled(Flexbox)`
  justify-content: space-between;
  cursor: pointer;
  padding: ${spacing[4]} ${spacing[6]};
  &:hover {
    background-color: ${colors.neutral[10]};
  }

  @media screen and (max-width: ${screens.sm}) {
    img {
      display: none;
    }
  }

  @media screen and (max-width: ${screens.xs}) {
    img {
      width: 2rem;
      height: 2rem;
    }
  }
`;

export const Textflex = styled(Flexbox)`
  justify-content: space-between;
  flex-grow: 1;
  > div {
    > p {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  @media screen and (min-width: ${screens.sm}) {
    > div {
      margin-left: ${spacing[6]};
    }
  }

  > p {
    white-space: nowrap;
  }
  @media screen and (max-width: ${screens.sm}) {
    > p {
      font-size: ${fontSize.sm};
    }
  }
`;
