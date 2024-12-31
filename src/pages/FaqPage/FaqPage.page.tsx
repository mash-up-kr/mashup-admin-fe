import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { OutputData } from '@editorjs/editorjs';
import { Editor, EditorAside } from '@/components';
import * as Styled from './FaqPage.styled';
import { $teams, $profile, $isMaster } from '@/store';
import { SelectSize } from '@/components/common/Select/Select.component';
import {
  decodeHTMLEntities,
  getDefaultEditorData,
  getLocalStorageData,
  removeWrongAmpString,
  request,
} from '@/utils';
import { useToast } from '@/hooks';
import { ToastType } from '@/components/common/Toast/Toast.component';
import * as api from '@/api';
import { Team } from '@/components/common/UserProfile/UserProfile.component';

const EDITOR_ID = 'platform-faq-editor';
const commonSelectOption = { label: '공통', value: 'common' };

const FaqPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [savedEditorData, setSavedEditorData] = useState<OutputData>(getDefaultEditorData());
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const storageKey = `faq-${selectedPlatform}`;

  const { handleAddToast } = useToast();
  const teams = useRecoilValue($teams);
  const teamOptions = useMemo(() => {
    return teams.map(({ name }) => ({
      value: name.toLowerCase(),
      label: name,
    }));
  }, [teams]);

  const myTeamName = useRecoilValue($profile)[0];
  const isMaster = useRecoilValue($isMaster);
  const isStaffUser = myTeamName === Team.mashUp || myTeamName === Team.branding;

  const teamSelectOptions = useMemo(() => {
    if (isMaster) {
      return [commonSelectOption, ...teamOptions];
    }
    const myTeamOptionObject = teamOptions.find(
      ({ label }) => label.toUpperCase() === myTeamName.toUpperCase(),
    );
    return [myTeamOptionObject ?? commonSelectOption];
  }, [teamOptions, myTeamName, isMaster]);

  const handleUpdateButtonClick = async () => {
    const originalOutputData = getLocalStorageData(EDITOR_ID);
    const storageValue = { editorData: originalOutputData };

    request({
      requestFunc: () => {
        setIsLoading(true);
        return api.postStorage({ keyString: storageKey, valueMap: storageValue });
      },
      errorHandler: () => {
        handleAddToast({
          type: ToastType.error,
          message: '자주 묻는 질문을 저장하지 못했습니다. 다시 시도해주세요.',
        });
      },
      onSuccess: () => {
        handleAddToast({
          type: ToastType.success,
          message: '성공적으로 자주 묻는 질문을 저장했습니다.',
        });
      },
      onCompleted: () => {
        setIsLoading(false);
      },
    });
  };

  const getFaqData = async () => {
    const { data } = await api.getStorage(storageKey);
    const editorOutputData = data.valueMap.editorData;

    const modifiedData = JSON.parse(
      decodeHTMLEntities(removeWrongAmpString(JSON.stringify(editorOutputData))),
    );

    return modifiedData;
  };

  useEffect(() => {
    const myTeamSelectOption = teamSelectOptions[0] ?? commonSelectOption;
    setSelectedPlatform(myTeamSelectOption.value);
  }, [teamSelectOptions]);

  useEffect(() => {
    const loadFaqDataToEditor = async () => {
      try {
        const newFaqData = await getFaqData();
        setSavedEditorData(newFaqData);
      } catch (error) {
        handleAddToast({
          type: ToastType.error,
          message: '자주 묻는 질문을 불러오지 못했습니다. 다시 시도해주세요.',
        });
        return getDefaultEditorData();
      }
    };

    const commonFaqDataRequired = !isStaffUser && selectedPlatform === 'common';

    if (selectedPlatform || commonFaqDataRequired) {
      loadFaqDataToEditor();
    }
  }, [selectedPlatform, isStaffUser]);

  return (
    <Styled.PageWrapper>
      <Styled.Heading>자주 묻는 질문</Styled.Heading>
      <Styled.EditorWrapper>
        <Editor id={EDITOR_ID} savedData={savedEditorData} />
        <EditorAside
          platform={
            <Styled.TeamSelect
              placeholder="플랫폼 선택"
              defaultValue={teamSelectOptions[0]}
              size={SelectSize.sm}
              options={teamSelectOptions}
              onChangeOption={(option) => {
                setSelectedPlatform(option.value);
              }}
            />
          }
          rightActionButton={{
            text: '수정',
            onClick: handleUpdateButtonClick,
            isLoading,
          }}
        />
      </Styled.EditorWrapper>
    </Styled.PageWrapper>
  );
};

export default FaqPage;
