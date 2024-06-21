import styled, { css } from "styled-components";

export const BtnView = styled.TouchableOpacity`
  height: 100px;
  width: 90%;
  /* border: 2px solid black; */
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  /* margin-top: 200px; */

  ${(props) =>
    props.clickButton
      ? css`
          background-color: #589ae8;
        `
      : css`
          background-color: #585859;
        `}
`;


export const BtnText = styled.Text`
  font-size: 16px;
  text-transform: uppercase;
  color: black;

  ${(props) =>
    props.clickButton
      ? css`
          color: black;
        `
      : css`
          color: white;
        `}
`;
