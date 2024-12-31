import React from 'react';
import { useRecoilCallback } from 'recoil';
import { useForm } from 'react-hook-form';
import { ModalWrapper, Select, TitleWithContent, MemberStatusBadge } from '@/components';
import * as Styled from './ChangeMemberStatusDialog.styled';
import { $modalByStorage, ModalKey } from '@/store';
import { SelectOption, SelectSize } from '@/components/common/Select/Select.component';
import { MemberResponse } from '@/types';

export interface ChangeMemberStatusDialogProps {
  selectedList: MemberResponse[];
  refreshList?: () => void;
}

const ChangeMemberStatusDialog = ({ selectedList }: ChangeMemberStatusDialogProps) => {
  const { setValue, handleSubmit } = useForm<any>();

  const handleRemoveCurrentModal = useRecoilCallback(({ set }) => () => {
    set($modalByStorage(ModalKey.changeMemberStatusDialog), {
      key: ModalKey.changeMemberStatusDialog,
      isOpen: false,
    });
  });

  const handleMemberStatusSubmit = useRecoilCallback(() => () => {});

  const props = {
    heading: '활동 상태 변경',
    footer: {
      cancelButton: {
        label: '취소',
      },
      confirmButton: {
        label: '변경',
        onClick: handleSubmit(handleMemberStatusSubmit),
        type: 'submit',
      },
    },
    handleCloseModal: handleRemoveCurrentModal,
    isContentScroll: false,
  };

  const handleMemberStatusSelect = (option: SelectOption) => {
    setValue(`memberStatus`, option.value);
  };

  return (
    <ModalWrapper {...props}>
      <Styled.ChangeMemberStatusContainer>
        <TitleWithContent title="선택인원">{selectedList?.length}</TitleWithContent>
        <Styled.SelectedResultArea title="선택된 활동 상태">
          {[...new Set(selectedList.map(({ memberStatus }) => memberStatus))].map((each) => (
            <MemberStatusBadge key={each} text={each} />
          ))}
        </Styled.SelectedResultArea>
        <Styled.Divider />
        <TitleWithContent title="변경할 활동 상태" isActive>
          <Select
            size={SelectSize.md}
            options={[
              { value: 'ACTIVE', label: '활동 중' },
              { value: 'TRANSFER', label: '다음 기수 이관' },
              { value: 'DROP_OUT', label: '중도하차' },
            ]}
            isFullWidth
            onChangeOption={handleMemberStatusSelect}
            placeholder="합격여부상태를 선택해주세요"
          />
        </TitleWithContent>
      </Styled.ChangeMemberStatusContainer>
    </ModalWrapper>
  );
};

export default ChangeMemberStatusDialog;
