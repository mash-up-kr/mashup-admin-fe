export const MemberStatus = {
  ACTIVE: 'ACTIVE',
  DROP_OUT: 'DROP_OUT',
  END: 'END',
  TRANSFER: 'TRANSFER',
} as const;

export type MemberStatusKeys = keyof typeof MemberStatus;

export interface MemberRequest {
  generationNumber?: number;
  page?: number;
  size?: number;
  platform?: string;
  sort?: string;
}

export interface MemberByIdRequest {
  generationNumber: number;
  memberId: number;
}

export interface MemberResponse {
  memberId: number;
  name: string;
  platform: string;
  score: number;
  identification: string;
  memberStatus: MemberStatusKeys;
}

export interface MemberByIdResponseData {
  generationNumber: number;
  identification: string;
  name: string;
  platform: string;
  scoreHistoryResponses: ScoreHistory[];
  totalScore: number;
}

export interface ScoreHistory {
  accumulatedScore: number;
  date: string;
  isCanceled: boolean;
  memo: string;
  scheduleName: string;
  score: number;
  scoreHistoryId: number;
  scoreName: string;
  scoreType: string;
}
