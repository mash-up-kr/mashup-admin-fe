import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRecoilStateLoadable, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { useSearchParams } from 'react-router-dom';

import Preview from '@/assets/svg/preview-20.svg';

import {
  TeamNavigationTabs,
  Button,
  Pagination,
  Table,
  Link,
  UserProfile,
  SearchOptionBar,
} from '@/components';
import { usePagination, useToggleState } from '@/hooks';
import { $applicationForms, $teamIdByName } from '@/store';
import { ApplicationFormResponse, Question, ApplicationFormRequest } from '@/types';
import { PATH, SORT_TYPE } from '@/constants';
import { formatDate } from '@/utils';
import { TableColumn } from '@/components/common/Table/Table.component';
import { TeamType, RoleType } from '@/components/common/UserProfile/UserProfile.component';
import { ApplicationFormPreviewModal } from '@/components/ApplicationForm/ApplicationFormPreview/ApplicationFormPreview.component';
import { ButtonShape, ButtonSize } from '@/components/common/Button/Button.component';

import * as Styled from './ApplicationFormList.styled';

const ApplicationFormPreview = ({ questions }: { questions: Question[] }) => {
  const [modalOpened, toggleModalOpened] = useToggleState(false);

  return (
    <>
      <Styled.Center>
        <Button Icon={Preview} shape={ButtonShape.smallIcon} onClick={toggleModalOpened} />
      </Styled.Center>
      {modalOpened && (
        <ApplicationFormPreviewModal questions={questions} toggleModalOpened={toggleModalOpened} />
      )}
    </>
  );
};

const columns: TableColumn<ApplicationFormResponse>[] = [
  {
    title: '플랫폼',
    accessor: 'team.name',
    widthRatio: '9%',
  },
  {
    title: '지원서 설문지 문서명',
    accessor: 'name',
    idAccessor: 'applicationFormId',
    widthRatio: '28%',
    renderCustomCell: (cellValue, id) => (
      <Styled.FormTitleWrapper title={cellValue as string}>
        <Styled.FormTitle>{cellValue as string}</Styled.FormTitle>
        <Styled.TitleLink to={`${PATH.APPLICATION_FORM}/${id}`} />
      </Styled.FormTitleWrapper>
    ),
  },
  {
    title: '작성자',
    accessor: 'createdBy',
    widthRatio: '14%',
    renderCustomCell: (cellValue) => {
      const [team, role] = (cellValue as string).split('_') as [TeamType, RoleType];
      return (
        <Styled.CustomUserProfile>
          <UserProfile team={team} role={role} showBackground={false} />
        </Styled.CustomUserProfile>
      );
    },
  },
  {
    title: '작성일시',
    accessor: 'createdAt',
    widthRatio: '21%',
    renderCustomCell: (cellValue) => formatDate(cellValue as string, 'YYYY년 M월 D일 A h시 m분'),
  },
  {
    title: '수정일시',
    accessor: 'updatedAt',
    widthRatio: '21%',
    renderCustomCell: (cellValue) => formatDate(cellValue as string, 'YYYY년 M월 D일 A h시 m분'),
  },
  {
    title: '미리보기',
    accessor: 'questions',
    renderCustomCell: (cellValue) => <ApplicationFormPreview questions={cellValue as Question[]} />,
    widthRatio: '7%',
  },
];

const ApplicationFormList = () => {
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get('team');
  const teamId = useRecoilValue($teamIdByName(teamName));

  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '20';

  const [searchWord, setSearchWord] = useState<{ value: string }>({ value: '' });

  const [sortTypes, setSortTypes] = useState<SortType<ApplicationFormRequest>[]>([
    { accessor: 'team.name', type: SORT_TYPE.DEFAULT },
    { accessor: 'name', type: SORT_TYPE.DEFAULT },
    { accessor: 'createdAt', type: SORT_TYPE.DEFAULT },
    { accessor: 'updatedAt', type: SORT_TYPE.DEFAULT },
  ]);
  const sortParam = useMemo(() => {
    const matched = sortTypes.find((sortType) => sortType.type !== SORT_TYPE.DEFAULT);
    if (!matched) return '';

    const { accessor, type } = matched;
    return `${accessor},${type}`;
  }, [sortTypes]);

  const applicationFormParams = useMemo<ApplicationFormRequest>(
    () => ({
      page: parseInt(page, 10) - 1,
      size: parseInt(size, 10),
      teamId: parseInt(teamId, 10) || undefined,
      searchWord: searchWord.value,
      sort: sortParam,
    }),
    [page, size, teamId, searchWord, sortParam],
  );

  const [{ state, contents: tableRows }] = useRecoilStateLoadable(
    $applicationForms(applicationFormParams),
  );
  const refreshApplicationForms = useRecoilRefresher_UNSTABLE(
    $applicationForms(applicationFormParams),
  );

  const isLoading = state === 'loading';
  const [loadedTableRows, setLoadedTableRows] = useState<ApplicationFormResponse[]>([]);

  const { pageOptions, handleChangePage, handleChangeSize } = usePagination(
    tableRows.page?.totalCount,
  );

  const handleSubmit = (
    e: { target: { searchWord: { value: string } } } & FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSearchWord({ value: e.target.searchWord.value });
  };

  useEffect(() => {
    if (!isLoading) {
      setLoadedTableRows(tableRows.data);
    }
  }, [isLoading, tableRows]);

  useEffect(() => {
    refreshApplicationForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, searchWord]);

  useEffect(() => {
    refreshApplicationForms();
    setSearchWord({ value: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return (
    <Styled.PageWrapper>
      <Styled.Heading>지원서 설문지 내역</Styled.Heading>
      <TeamNavigationTabs />
      <SearchOptionBar searchWord={searchWord} handleSubmit={handleSubmit} />
      <Table<ApplicationFormResponse>
        prefix="application-form"
        columns={columns}
        rows={loadedTableRows}
        maxHeight={72}
        isLoading={isLoading}
        supportBar={{
          totalCount: tableRows.page?.totalCount,
          totalSummaryText: '총 지원설문지',
          buttons: [
            <Link to={PATH.APPLICATION_FORM_CREATE}>
              <Button $size={ButtonSize.xs} shape={ButtonShape.primary}>
                지원서 설문지 작성
              </Button>
            </Link>,
          ],
        }}
        sortOptions={{
          sortTypes,
          disableMultiSort: true,
          handleSortColumn: (_sortTypes) => {
            setSortTypes(_sortTypes);
          },
        }}
        pagination={
          <Pagination
            pageOptions={pageOptions}
            selectableSize
            selectBoxPosition={loadedTableRows.length > 3 ? 'top' : 'bottom'}
            handleChangePage={handleChangePage}
            handleChangeSize={handleChangeSize}
          />
        }
      />
    </Styled.PageWrapper>
  );
};

export default ApplicationFormList;
