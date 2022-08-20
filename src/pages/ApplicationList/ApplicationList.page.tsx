import React, {
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  FormEvent,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { writeFileXLSX } from 'xlsx';
import {
  useRecoilStateLoadable,
  useRecoilValue,
  useSetRecoilState,
  useRecoilRefresher_UNSTABLE,
} from 'recoil';
import dayjs from 'dayjs';
import * as api from '@/api';
import {
  BottomCTA,
  Button,
  Pagination,
  SearchOptionBar,
  Table,
  TeamNavigationTabs,
} from '@/components';
import { formatDate, uniqArray } from '@/utils';
import { PATH, SORT_TYPE } from '@/constants';
import { $applications, $teamIdByName, ModalKey, $modalByStorage, $profile } from '@/store';
import { useConvertToXlsx, useDirty, usePagination } from '@/hooks';
import { ApplicationRequest, ApplicationResponse } from '@/types';
import { SortType, TableColumn } from '@/components/common/Table/Table.component';
import { ButtonShape, ButtonSize } from '@/components/common/Button/Button.component';
import ApplicationStatusBadge, {
  ApplicationConfirmationStatus,
  ApplicationConfirmationStatusKeyType,
  ApplicationResultStatus,
  ApplicationResultStatusKeyType,
} from '@/components/common/ApplicationStatusBadge/ApplicationStatusBadge.component';
import { ApplicationFilterValuesType } from '@/components/common/SearchOptionBar/SearchOptionBar.component';
import * as Styled from './ApplicationList.styled';
import { scrollTo } from '@/utils/scroll';

const APPLICATION_EXTRA_SIZE = 100;

const ApplicationList = () => {
  const handleSMSModal = useSetRecoilState($modalByStorage(ModalKey.smsSendModalDialog));
  const handleResultModal = useSetRecoilState($modalByStorage(ModalKey.changeResultModalDialog));

  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get('team');
  const teamId = useRecoilValue($teamIdByName(teamName));
  const myTeamName = useRecoilValue($profile)[0];
  const isMyTeam = useMemo(
    () =>
      !teamName ||
      teamName.toLowerCase() === myTeamName.toLowerCase() ||
      myTeamName === 'BRANDING' ||
      myTeamName === 'MASHUP',
    [myTeamName, teamName],
  );

  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '20';

  const [searchWord, setSearchWord] = useState<{ value: string }>({ value: '' });
  const [filterValues, setFilterValues] = useState<ApplicationFilterValuesType>({
    confirmStatus: { label: '', value: '' },
    resultStatus: { label: '', value: '' },
  });

  const [sortTypes, setSortTypes] = useState<SortType<ApplicationResponse>[]>([
    { accessor: 'applicant.name', type: SORT_TYPE.DEFAULT },
    { accessor: 'submittedAt', type: SORT_TYPE.DEFAULT },
    { accessor: 'result.interviewStartedAt', type: SORT_TYPE.DEFAULT },
  ]);
  const sortParam = useMemo(() => {
    const matched = sortTypes.find((sortType) => sortType.type !== SORT_TYPE.DEFAULT);
    if (!matched) return '';

    const { accessor, type } = matched;
    const accessorKeys = accessor.split('.');

    if (accessorKeys[0] === 'result') {
      const resultAccessor = ['applicationResult'].concat(accessorKeys.slice(1)).join('.');
      return `${resultAccessor},${type}`;
    }

    return `${accessor},${type}`;
  }, [sortTypes]);

  const applicationParams = useMemo<ApplicationRequest>(
    () => ({
      page: parseInt(page, 10) - 1,
      size: parseInt(size, 10),
      teamId: parseInt(teamId, 10) || undefined,
      searchWord: searchWord.value,
      confirmStatus: filterValues?.confirmStatus?.value,
      resultStatus: filterValues?.resultStatus?.value,
      sort: sortParam,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, size, teamId, searchWord, sortParam, filterValues],
  );

  const [totalCount, setTotalCount] = useState(0);
  const [{ state, contents: tableRows }] = useRecoilStateLoadable($applications(applicationParams));
  const refreshApplications = useRecoilRefresher_UNSTABLE($applications(applicationParams));
  const [selectedRows, setSelectedRows] = useState<ApplicationResponse[]>([]);
  const selectedResults = useMemo(
    () =>
      uniqArray(selectedRows.map((row) => row.result.status)) as ApplicationResultStatusKeyType[],
    [selectedRows],
  );

  const isLoading = state === 'loading';
  const [loadedTableRows, setLoadedTableRows] = useState<ApplicationResponse[]>(
    tableRows.data || [],
  );

  const { getWorkBook } = useConvertToXlsx({
    workSheet: selectedRows.map((each: ApplicationResponse) => ({
      이름: each.applicant.name,
      전화번호: each.applicant.phoneNumber,
      지원플랫폼: each.team.name,
      지원일시: each.submittedAt
        ? formatDate(each.submittedAt, 'YYYY년 M월 D일(ddd) a hh시 mm분')
        : '',
      면접일시: each.result.interviewStartedAt
        ? formatDate(each.result.interviewStartedAt, 'YYYY년 M월 D일(ddd) a hh시 mm분')
        : '',
      사용자확인여부: ApplicationConfirmationStatus[each.confirmationStatus],
      합격여부: ApplicationResultStatus[each.result.status],
    })),
    teamName: teamName || '전체',
    isLoading,
  });

  const { pageOptions, handleChangePage, handleChangeSize } = usePagination({
    totalCount: tableRows.page?.totalCount,
  });

  const { makeDirty, isDirty } = useDirty(1);

  const handleSearch = (
    e: { target: { searchWord: { value: string } } } & FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSearchWord({ value: e.target.searchWord.value });
  };

  const handleSelectAll = useCallback(
    async (checkedValue) => {
      if (checkedValue) {
        setSelectedRows([]);
      } else {
        const applications = await api.getApplications({
          page: 0,
          size: tableRows.page.totalCount + APPLICATION_EXTRA_SIZE,
          teamId: parseInt(teamId, 10) || undefined,
        });
        setSelectedRows(applications.data);
        if (applications.page) {
          setTotalCount(applications.page.totalCount);
        }
      }
    },
    [tableRows.page?.totalCount, teamId],
  );

  const columns: TableColumn<ApplicationResponse>[] = [
    {
      title: '이름',
      accessor: 'applicant.name',
      idAccessor: 'applicationId',
      widthRatio: '10%',
      renderCustomCell: (cellValue, id, handleClickLink, applicationParamStates) => (
        <Styled.FormTitleWrapper title={cellValue as string}>
          <Styled.FormTitle>{cellValue as string}</Styled.FormTitle>
          {handleClickLink ? (
            <Styled.TitleButton type="button" onClick={handleClickLink} />
          ) : (
            <Styled.TitleLink
              to={`${PATH.APPLICATION}/${id}`}
              state={{ ...applicationParamStates, from: `${pathname}${search}` }}
            />
          )}
        </Styled.FormTitleWrapper>
      ),
    },
    {
      title: '전화번호',
      accessor: 'applicant.phoneNumber',
      widthRatio: '14%',
    },
    {
      title: '지원플랫폼',
      accessor: 'team.name',
      widthRatio: '8%',
    },
    {
      title: '지원일시',
      accessor: 'submittedAt',
      widthRatio: '21%',
      renderCustomCell: (cellValue) =>
        cellValue ? formatDate(cellValue as string, 'YYYY년 M월 D일 A h시 m분') : '-',
    },
    {
      title: '면접일시',
      accessor: 'result.interviewStartedAt',
      widthRatio: '21%',
      renderCustomCell: (cellValue) =>
        cellValue ? formatDate(cellValue as string, 'YYYY년 M월 D일 A h시 m분') : '-',
    },
    {
      title: '사용자확인여부',
      accessor: 'confirmationStatus',
      widthRatio: '13%',
      renderCustomCell: (cellValue) => (
        <Styled.Center>
          <ApplicationStatusBadge
            text={ApplicationConfirmationStatus[cellValue as ApplicationConfirmationStatusKeyType]}
          />
        </Styled.Center>
      ),
    },
    {
      title: '합격여부',
      accessor: 'result.status',
      widthRatio: '13%',
      renderCustomCell: (cellValue) => (
        <Styled.Center>
          <ApplicationStatusBadge
            text={ApplicationResultStatus[cellValue as ApplicationResultStatusKeyType]}
          />
        </Styled.Center>
      ),
    },
  ];

  useEffect(() => {
    if (!isLoading) {
      setLoadedTableRows(tableRows.data);
      setTotalCount(tableRows.page.totalCount);
      makeDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tableRows]);

  useEffect(() => {
    setSearchWord({ value: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamName]);

  useLayoutEffect(() => {
    if (isDirty && !isLoading) {
      scrollTo(0, 179, { useAnimation: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedTableRows]);

  return (
    <Styled.PageWrapper>
      <Styled.Heading>지원서 내역</Styled.Heading>
      <Styled.StickyContainer>
        <TeamNavigationTabs />
        <SearchOptionBar
          placeholder="이름, 전화번호 검색"
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          searchWord={searchWord}
          handleSubmit={handleSearch}
        />
      </Styled.StickyContainer>
      <Table
        prefix="application"
        topStickyHeight={14.1}
        columns={columns}
        rows={loadedTableRows}
        isLoading={isLoading}
        supportBar={{
          totalCount,
          totalSummaryText: '총 지원인원',
          selectedSummaryText: '명 선택',
          buttons: [
            <Button
              $size={ButtonSize.xs}
              shape={ButtonShape.defaultLine}
              onClick={() =>
                handleSMSModal({
                  key: ModalKey.smsSendModalDialog,
                  props: {
                    selectedApplications: selectedRows,
                    showSummary: true,
                  },
                  isOpen: true,
                })
              }
              disabled={selectedResults.length === 0 && isMyTeam}
            >
              SMS 발송
            </Button>,
            <Button
              $size={ButtonSize.xs}
              shape={ButtonShape.defaultLine}
              onClick={() =>
                handleResultModal({
                  key: ModalKey.changeResultModalDialog,
                  props: {
                    selectedList: selectedRows.map((row) => row.applicationId),
                    selectedResults,
                    refreshList: () => {
                      refreshApplications();
                      setSelectedRows([]);
                    },
                  },
                  isOpen: true,
                })
              }
              disabled={selectedResults.length === 0 && isMyTeam}
            >
              합격 여부 변경
            </Button>,
            <Button
              $size={ButtonSize.xs}
              shape={ButtonShape.defaultLine}
              onClick={() => {
                const workBook = getWorkBook();

                if (!workBook) {
                  return;
                }
                writeFileXLSX(
                  workBook,
                  `${formatDate(dayjs().format(), 'YYYY년 M월 D일(ddd)')}-${
                    teamName || '전체'
                  }.xlsx`,
                );
              }}
              disabled={selectedRows.length === 0}
            >
              Export to Excel
            </Button>,
          ],
        }}
        selectableRow={{
          selectedCount: selectedRows.length,
          selectedRows,
          setSelectedRows,
          handleSelectAll,
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
            selectableSize={{
              selectBoxPosition: loadedTableRows.length > 3 ? 'top' : 'bottom',
              handleChangeSize,
            }}
            handleChangePage={handleChangePage}
          />
        }
        applicationParams={applicationParams}
        isMyTeam={isMyTeam}
      />
      <BottomCTA
        boundaries={{
          visibility: { topHeight: 179, bottomHeight: 20 },
          noAnimation: { bottomHeight: 20 },
        }}
      >
        <Pagination
          pageOptions={pageOptions}
          selectableSize={{
            selectBoxPosition: loadedTableRows.length > 3 ? 'top' : 'bottom',
            handleChangeSize,
          }}
          handleChangePage={handleChangePage}
        />
      </BottomCTA>
    </Styled.PageWrapper>
  );
};

export default ApplicationList;
