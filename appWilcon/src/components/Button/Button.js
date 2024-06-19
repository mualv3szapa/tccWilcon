import { BtnText, BtnView } from "./Style";

export const ButtonONOFF = ({ clickButton = false, onPress, TextBtn }) => {
  return (
    <BtnView onPress={onPress} clickButton={clickButton}>
      <BtnText>{TextBtn}</BtnText>
    </BtnView>
  );
};
