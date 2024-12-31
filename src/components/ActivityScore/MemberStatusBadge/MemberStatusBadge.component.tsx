import React from 'react';
import { MemberStatusKeys } from '@/types';
import * as Styled from './MemberStatusBadge.styled';

interface MemberStatusBadgeProps {
  text: MemberStatusKeys;
}

const MemberStatusBadge = ({ text }: MemberStatusBadgeProps) => {
  const displayText = {
    ACTIVE: '활동 중',
    DROP_OUT: '중도하차',
    END: '활동종료',
    TRANSFER: '다음 기수 이관',
  }?.[text];

  if (!displayText) return null;
  return <Styled.MemberStatusBadge text={text}>{displayText}</Styled.MemberStatusBadge>;
};

export default MemberStatusBadge;
