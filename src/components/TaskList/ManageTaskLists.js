import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row, ButtonGroup } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import AddTaskList from '../../components/TaskList/AddTaskList';
import TaskLists from '../../components/TaskList/TaskLists';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { getPageTitleContent } from '../../utils/ListUtils';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
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

export default function ManageTaskLists({ listType }) {

  //navigate
  const navigate = useNavigate();

  //user
  const { currentUser } = useAuth();

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

  //states
  const [loading, setLoading] = useState(true);
  const [showAddTaskList, setShowAddTaskList] = useState(false);
  const [taskLists, setTaskLists] = useState();
  const [originalTaskLists, setOriginalTaskLists] = useState();
  const [counter, setCounter] = useState(0);

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      await fetchTaskListsFromFireBase();
    }
    getTaskLists();
  }, [])

  const fetchTaskListsFromFireBase = async () => {
    const dbref = ref(db, Constants.DB_TASKLISTS); //.orderByChild("listType").equalTo(Number(listType));;
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      let counterTemp = 0;
      for (let id in snap) {
        const item = snap[id];
        if ((item["listType"] === listType && listType > 0) ||
          (item["listType"] === undefined && listType === 0)) {
          counterTemp++;
          fromDB.push({ id, ...snap[id] });
        }
      }
      setCounter(counterTemp);
      setLoading(false);
      setTaskLists(fromDB);
      setOriginalTaskLists(fromDB);
    })
  }

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

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button text={t('button_goto_tasklist_archive')} color="#545454" onClick={() => gotoTaskListArchive()} />
        </ButtonGroup>
      </Row>
      <PageTitle title={getPageTitle(listType)} />

      <div style={{ marginBottom: '10px' }}>
        <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')} iconName={Constants.ICON_COPY} /> &nbsp;
      </div>

      <SearchSortFilter
        useTitleFiltering={true}
        onSet={setTaskLists}
        showSortByTitle={true}
        showSortByCreatedDate={true}
        showSearchByDescription={true}
        originalList={originalTaskLists} />

      <CenterWrapper>
        <Button
          color={showAddTaskList ? 'red' : 'green'}
          text={showAddTaskList ? t('button_close') : t('button_add_list')}
          onClick={() => setShowAddTaskList(!showAddTaskList)} />
      </CenterWrapper>

      {showAddTaskList &&
        <AddTaskList onClose={() => setShowAddTaskList(false)} onSave={addTaskList} />
      }

      {taskLists != null && taskLists.length > 0 ? (
        <>
          <Counter list={taskLists} originalList={originalTaskLists} counter={counter} text={t('tasklists')} />
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