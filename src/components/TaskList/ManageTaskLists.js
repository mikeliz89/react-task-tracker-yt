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
import { getPageTitleContent } from '../../utils/ListUtils';
import Button from '../Buttons/Button';
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

  const addTaskList = async (taskList) => {
    taskList["created"] = getCurrentDateAsJson();
    taskList["createdBy"] = currentUser.email;
    if (listType === undefined || listType === 0) {
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

  function gotoTaskListArchive() {
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

  const copyToClipboard = () => {
    let text = "";
    taskLists.forEach(function (arrayItem) {
      text += "" + arrayItem.title;
      text += "\n";
    });
    navigator.clipboard.writeText(text);
  }

  const getDefaultTitle = (listType) => {
    if (listType === ListTypes.Shopping) {
      let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
      return t('shoppinglist') + ' ' + currentDateTime;
    }
    return "";
  }

  const getCounterText = (listType) => {

    const counterTextContentKey = () => {
      switch (listType) {
        case ListTypes.Shopping:
          return 'countertext_shoppinglists';
        case ListTypes.Drink:
          return 'countertext_drinklists';
        case ListTypes.Programming:
          return 'countertext_programminglists';
        case ListTypes.Food:
          return 'countertext_recipelists';
        case ListTypes.Music:
          return 'countertext_musiclists';
        case ListTypes.Games:
          return 'countertext_gamelists';
        case ListTypes.BoardGames:
          return 'countertext_boardgamelists';
        case ListTypes.Movies:
          return 'countertext_movielists';
        case ListTypes.Other:
          return 'countertext_otherlists';
        case ListTypes.Car:
          return 'countertext_carlists';
        case ListTypes.Exercises:
          return 'countertext_exercises';
        case ListTypes.BackPacking:
          return 'countertext_backpacking';
        default:
          return 'countertext_tasklists';
      }
    }

    var contentKey = counterTextContentKey();
    return t(contentKey);
  }

  return (
    <ManagePage
      loading={loading}
      loadingText={tCommon("loading")}
      title={getPageTitle(listType)}
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
      centerActions={
        <>
          <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')}
            iconName={ICONS.COPY} />
          &nbsp;
        </>
      }
      addButton={{
        show: showAddTaskList,
        iconName: ICONS.PLUS,
        openColor: COLORS.ADDBUTTON_OPEN,
        closedColor: COLORS.ADDBUTTON_CLOSED,
        openText: tCommon('buttons.button_close'),
        closedText: t('button_add_list'),
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
          taskLists={taskLists}
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


