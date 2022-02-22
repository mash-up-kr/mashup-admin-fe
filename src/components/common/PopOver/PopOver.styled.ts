import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface StyledPopOverWrapperProps {
  isOpen: boolean;
}
export const PopOverWrapper = styled.div<StyledPopOverWrapperProps>`
  ${({ isOpen }) => css`
    position: relative;
    width: fit-content;
    text-align: center;

    ${isOpen
      ? css`
          height: 3.5rem;
        `
      : css`
          height: fit-content;
        `};
  `}
`;

// TODO:(용재) 추후 svg를 붙이거나 css로 마크업 처리하기
export const TopArrow = styled.div`
  position: absolute;
  top: 0rem;
  right: 0rem;
  width: 14rem;
  height: 4.5rem;
`;

export const Content = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: 4.5rem;
    right: 0rem;
    width: 14rem;
    min-height: 5rem;
    padding: 1.7rem 2rem;
    background-color: ${theme.colors.white};
    border: 0.15rem solid ${theme.colors.gray40};
    border-radius: 1.5rem;
    box-shadow: 0px 0.1rem 1rem rgba(0, 0, 0, 0.08);
  `}
`;

export const Select = styled.button`
  ${({ theme }) => css`
    ${theme.fonts.medium14}
    display: flex;
    gap: 0.7rem;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 0;
    color: ${theme.colors.gray70};
    background-color: transparent;

    &:hover {
      background-color: ${theme.colors.gray10};
      border-radius: 0.5rem;
    }
  `}
`;