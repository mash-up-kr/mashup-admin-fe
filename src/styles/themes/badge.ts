import { css, SerializedStyles } from '@emotion/react';
import {
  ApplicationResultStatus,
  ApplicationConfirmationStatus,
} from '@/components/common/ApplicationStatusBadge/ApplicationStatusBadge.component';
import { colors } from '.';
import { EmailStatus, MemberStatus } from '@/types';

export const badge: { [key: string]: SerializedStyles } = {
  [ApplicationResultStatus.NOT_RATED]: css`
    color: ${colors.gray60};
    background-color: ${colors.gray20};
  `,
  [ApplicationResultStatus.SCREENING_TO_BE_DETERMINED]: css`
    color: ${colors.blue70};
    background-color: ${colors.blue20};
  `,
  [ApplicationResultStatus.SCREENING_FAILED]: css`
    color: ${colors.white};
    background-color: ${colors.orange70};
  `,
  [ApplicationResultStatus.SCREENING_PASSED]: css`
    color: ${colors.white};
    background-color: ${colors.blue70};
  `,
  [ApplicationResultStatus.INTERVIEW_FAILED]: css`
    color: ${colors.white};
    background-color: ${colors.red70};
  `,
  [ApplicationResultStatus.INTERVIEW_TO_BE_DETERMINED]: css`
    color: ${colors.purple70};
    background-color: ${colors.purple20};
  `,
  [ApplicationResultStatus.INTERVIEW_PASSED]: css`
    color: ${colors.white};
    background-color: ${colors.green70};
  `,
  [ApplicationConfirmationStatus.TO_BE_DETERMINED]: css`
    color: ${colors.gray60};
    background-color: ${colors.gray20};
  `,
  [ApplicationConfirmationStatus.NOT_APPLICABLE]: css`
    color: ${colors.white};
    background-color: ${colors.gray60};
  `,
  [ApplicationConfirmationStatus.INTERVIEW_CONFIRM_WAITING]: css`
    color: ${colors.blue70};
    background-color: ${colors.blue20};
  `,
  [ApplicationConfirmationStatus.INTERVIEW_CONFIRM_ACCEPTED]: css`
    color: ${colors.white};
    background-color: ${colors.blue70};
  `,
  [ApplicationConfirmationStatus.INTERVIEW_CONFIRM_REJECTED]: css`
    color: ${colors.red70};
    background-color: ${colors.red20};
  `,
  [ApplicationConfirmationStatus.FINAL_CONFIRM_WAITING]: css`
    color: ${colors.purple70};
    background-color: ${colors.purple20};
  `,
  [ApplicationConfirmationStatus.FINAL_CONFIRM_ACCEPTED]: css`
    color: ${colors.white};
    background-color: ${colors.green70};
  `,
  [ApplicationConfirmationStatus.FINAL_CONFIRM_REJECTED]: css`
    color: ${colors.white};
    background-color: ${colors.red70};
  `,
  [ApplicationConfirmationStatus.TO_BE_DETERMINED]: css`
    color: ${colors.gray60};
    background-color: ${colors.gray20};
  `,
  [EmailStatus.CREATED]: css`
    color: ${colors.blue70};
    border: 0.1rem solid ${colors.blue70};
  `,
  [EmailStatus.FAIL]: css`
    color: ${colors.red70};
    border: 0.1rem solid ${colors.red70};
  `,
  [EmailStatus.SUCCESS]: css`
    color: ${colors.blue70};
    border: 0.1rem solid ${colors.blue70};
  `,
  [MemberStatus.ACTIVE]: css`
    color: ${colors.blue70};
    background-color: ${colors.blue20};
  `,
  [MemberStatus.DROP_OUT]: css`
    color: ${colors.white};
    background-color: ${colors.red100};
  `,
  [MemberStatus.TRANSFER]: css`
    color: ${colors.purple70};
    background-color: ${colors.purple20};
  `,
} as const;

export type BadgeTheme = typeof badge;
