import { css } from "styled-components";

export const mobile = (props) => {
  return css`
    @media only screen and (min-width: 370px) {
      ${props}
    }
  `;
};

export const tablet = (props) => {
  return css`
    @media only screen and (min-width: 768px) {
      ${props}
    }
  `;
}
