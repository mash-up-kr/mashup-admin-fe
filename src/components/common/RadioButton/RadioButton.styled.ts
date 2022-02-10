import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { RadioButtonProps } from './RadioButton.component';

export const RadioButtonWrapper = styled.label<Pick<RadioButtonProps, 'disabled'>>`
  ${({ disabled }) => css`
    ${disabled && 'pointer-events: none; opacity: 0.5;'}
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: fit-content;
    height: 1.2rem;
    padding: 0 0;
    cursor: pointer;
    user-select: none;
  `}
`;

export const RadioButtonInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

export const RadioButtonMark = styled.span`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.2rem;
    height: 1.2rem;
    background-color: ${theme.colors.white};
    border: solid 0.1rem ${theme.colors.gray30};
    border-radius: 50%;

    label:hover input ~ & {
      opacity: 0.9;
    }

    label input:checked ~ & {
      border-color: ${theme.colors.purple70};

      > span {
        width: 0.5rem;
        height: 0.5rem;
        background-color: ${theme.colors.purple70};
        border-radius: 50%;
      }
    }

    label input:checked ~ &::after {
      display: block;
    }
  `}
`;

export const RadioButtonText = styled.span`
  ${({ theme }) => css`
    ${theme.fonts.medium14}
    padding-left: 2rem;
  `}
`;
