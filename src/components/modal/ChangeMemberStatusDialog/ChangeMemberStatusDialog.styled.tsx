import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Textarea, TitleWithContent } from '@/components';

export const ChangeMemberStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 70rem;
  height: 23.6rem;
  padding: 1.2rem 2.4rem;
`;

export const CustomTextarea = styled(Textarea)`
  ${({ theme }) => css`
    width: 100%;

    & textarea {
      ${theme.fonts.regular13}

      color: ${theme.colors.gray70};
    }
  `}
`;

export const SelectedResultArea = styled(TitleWithContent)`
  & > span {
    display: inline-flex;
    gap: 0.6rem;
    width: unset !important;

    & > div {
      margin: unset;
    }
  }
`;

export const Divider = styled.div`
  ${({ theme }) => css`
    height: 0.1rem;
    background-color: ${theme.colors.gray30};
  `}
`;
