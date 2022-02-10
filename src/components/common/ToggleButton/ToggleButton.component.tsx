import React from 'react';
import * as Styled from './ToggleButton.styled';

export interface ToggleButtonProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  handleToggle: () => void;
  disabled?: boolean;
  isChecked?: boolean;
}

const ToggleButton = ({
  handleToggle,
  disabled = false,
  isChecked,
  ...resetProps
}: ToggleButtonProps) => {
  return (
    <Styled.ToggleButtonLabel {...resetProps} disabled={disabled}>
      <Styled.ToggleButtonInput type="checkbox" onChange={handleToggle} checked={isChecked} />
      <Styled.ToggleButtonSlider />
    </Styled.ToggleButtonLabel>
  );
};

export default ToggleButton;
