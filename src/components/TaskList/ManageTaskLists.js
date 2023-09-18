import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import { useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import AddTaskList from '../../components/TaskList/AddTaskList';
import TaskLists from '../../components/TaskList/TaskLists';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import { getPageTitleContent } from '../../utils/ListUtils';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { ListTypes } from '../../utils/Enums';
import PropTypes from 'prop-types';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import { pushToFirebase, removeFromFirebaseById, removeFromFirebaseChild } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';

export default function ManageTaskLists({ listType }) {

  //navigate
  const navigate = useNavigate();

  //user
  const { currentUser } = useAuth();

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

  //fetch data
  const { data: taskLists, setData: setTaskLists,
    originalData: originalTaskLists, counter, loading } = useFetch(Constants.DB_TASKLISTS, listType);

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
    const key = await pushToFirebase(Constants.DB_TASKLISTS, taskList);
    navigate(`${Constants.NAVIGATION_TASKLIST}/${key}`);
  }

  const deleteTaskList = async (id) => {
    //delete tasks
    removeFromFirebaseById(Constants.DB_TASKS, id);
    //delete task list
    removeFromFirebaseChild(Constants.DB_TASKLISTS, id);
  }

  function gotoTaskListArchive() {
    navigate(Constants.NAVIGATION_TASKLIST_ARCHIVE, {
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

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={getPageTitle(listType)} />

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button text={t('button_goto_tasklist_archive')}
            color={Constants.COLOR_BUTTON_GRAY}
            onClick={() => gotoTaskListArchive()}
          />
        </ButtonGroup>
      </Row>

      {
        originalTaskLists != null && originalTaskLists.length > 0 ? (
          <SearchSortFilter
            onSet={setTaskLists}
            originalList={originalTaskLists}
            //search
            showSearchByText={true}
            showSearchByDescription={true}
            //sort
            showSortByTitle={true}
            showSortByCreatedDate={true}
            //filter
            filterMode={FilterMode.Title}
          />
        ) : (<></>)
      }

      <CenterWrapper>
        <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')}
          iconName={Constants.ICON_COPY} />
        &nbsp;
        <Button
          iconName={Constants.ICON_PLUS}
          color={showAddTaskList ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
          text={showAddTaskList ? t('button_close') : t('button_add_list')}
          onClick={toggleAddTaskList} />
      </CenterWrapper>

      <Modal show={showAddTaskList} onHide={toggleAddTaskList}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal_header_add_list')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTaskList
            onClose={toggleAddTaskList}
            onSave={addTaskList} showLabels={true}
            defaultTitle={getDefaultTitle(listType)} />
        </Modal.Body>
      </Modal>

      {taskLists != null && taskLists.length > 0 ? (
        <>
          <Counter list={taskLists} originalList={originalTaskLists} counter={counter} text={getCounterText(listType)} />
          <TaskLists
            taskLists={taskLists}
            onDelete={deleteTaskList}
          />
        </>
      ) : (
        <>
          <CenterWrapper>
            {t('no_task_lists_to_show')}
          </CenterWrapper>
        </>
      )
      }
    </PageContentWrapper>
  )
}


ManageTaskLists.defaultProps = {
  listType: ListTypes.None
}

ManageTaskLists.propTypes = {
  listType: PropTypes.any
}