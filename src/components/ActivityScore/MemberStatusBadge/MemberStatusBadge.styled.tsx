import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MemberStatus } from '@/types';

interface MemberStatusBadgeProps {
  text: keyof typeof MemberStatus;
}

export const MemberStatusBadge = styled.div<MemberStatusBadgeProps>`
  ${({ theme, text }) => css`
    ${theme.fonts.medium13}
    ${theme.badge[text]}
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8.6rem;
    height: 2.8rem;
    margin: 0 auto;
    border-radius: 0.8rem;
    cursor: default;
  `}
`;
