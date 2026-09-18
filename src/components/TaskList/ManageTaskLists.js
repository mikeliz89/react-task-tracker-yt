import i18n from "i18next";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AddTaskList from '../../components/TaskList/AddTaskList';
import TaskLists from '../../components/TaskList/TaskLists';
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, removeFromFirebaseChild } from '../../datatier/datatier';
import { COLORS, TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { ListTypes } from '../../utils/Enums';
import { getCounterTextContentKey, getPageTitleContent } from '../../utils/ListUtils';
import Button from '../Buttons/Button';
import CopyToClipboardButton from '../Buttons/CopyToClipboardButton';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import ManagePage from '../Site/ManagePage';

export default function ManageTaskLists({ listType = ListTypes.None }) {

  //navigate
  const navigate = useNavigate();

  //user
  const { currentUser } = useAuth();

  //translation
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //fetch data
  const { data: taskLists, setData: setTaskLists,
    originalData: originalTaskLists, counter, loading } = useFetch(DB.TASKLISTS, listType);

  //modal
  const { status: showAddTaskList, toggleStatus: toggleAddTaskList } = useToggle();
  const isGenericListType = listType == null || listType === ListTypes.None;
  const isShoppingListType = listType === ListTypes.Shopping;

  const addTaskList = async (taskList) => {
    taskList["created"] = getCurrentDateAsJson();
    taskList["createdBy"] = currentUser.email;
    if (isGenericListType) {
      delete taskList["listType"];
    } else {
      taskList["listType"] = listType;
    }
    const key = await pushToFirebase(DB.TASKLISTS, taskList);
    navigate(`${NAVIGATION.TASKLIST}/${key}`);
  }

  const deleteTaskList = async (id) => {
    //delete tasks
    removeFromFirebaseById(DB.TASKS, id);
    //delete task list
    removeFromFirebaseChild(DB.TASKLISTS, id);
  }

  const gotoTaskListArchive = () => {
    navigate(NAVIGATION.TASKLIST_ARCHIVE, {
      state: {
        listType: listType
      }
    });
  }

  const getPageTitle = (listType) => {
    const contentKey = getPageTitleContent(listType);
    return t(contentKey);
  }

  const getDefaultTitle = (listType) => {
    if (isShoppingListType) {
      let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
      return t('shoppinglist') + ' ' + currentDateTime;
    }
    return "";
  }

  const getCounterText = (listType) => {
    return t(getCounterTextContentKey(listType));
  }

  return (
    <ManagePage
      loading={loading}
      loadingText={tCommon("loading")}
      title={getPageTitle(listType)}
      listType={listType}
      iconName={ICONS.LIST_ALT}
      topActions={(
        <>
          <Button text={t('button_goto_tasklist_archive')}
            color={COLORS.BUTTON_GRAY}
            onClick={() => gotoTaskListArchive()}
          />
        </>
      )}
      searchSortFilter={{
        onSet: setTaskLists,
        originalList: originalTaskLists,
        //search
        showSearchByText: true,
        showSearchByDescription: true,
        //sort
        showSortByTitle: true,
        showSortByCreatedDate: true,
        //filter
        filterMode: FilterMode.Title,
      }}
      listViewToggle={{
        enabled: true,
        storageKey: `manage-tasklists-view-${listType}`,
      }}
      centerActions={
        <>
          <CopyToClipboardButton
            items={Array.isArray(taskLists) ? taskLists : []}
          />
          &nbsp;
        </>
      }
      addButton={{
        show: showAddTaskList,
        onToggle: toggleAddTaskList,
      }}
      modal={{
        show: showAddTaskList,
        onHide: toggleAddTaskList,
        title: t('modal_header_add_list'),
        body: (
          <AddTaskList
            onClose={toggleAddTaskList}
            onSave={addTaskList} showLabels={true}
            autoFocusTitle={true}
            defaultTitle={getDefaultTitle(listType)} />
        ),
      }}
      hasItems={taskLists != null && taskLists.length > 0}
      emptyText={t('no_task_lists_to_show')}
    >
      <>
        <TaskLists
          items={taskLists}
          originalList={originalTaskLists}
          counter={counter}
          counterText={getCounterText(listType)}
          onDelete={deleteTaskList}
        />
      </>
    </ManagePage>
  )
}

ManageTaskLists.defaultProps = {
  listType: ListTypes.None
}

ManageTaskLists.propTypes = {
  listType: PropTypes.any
}