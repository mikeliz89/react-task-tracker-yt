//React
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Col, Row, ButtonGroup, Form } from 'react-bootstrap';
//Firebase
import { db } from '../../firebase-config';
import { ref, onValue, push, child, remove } from "firebase/database";
//TaskList components
import AddTaskList from '../../components/TaskList/AddTaskList';
import TaskLists from '../../components/TaskList/TaskLists';
//Buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//Utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//Context
import { useAuth } from '../../contexts/AuthContext';
//PageTitle
import PageTitle from '../PageTitle';
//SearchSortFilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

export default function ManageTaskLists() {

  //constants
  const DB_TASKLISTS = '/tasklists';
  const DB_TASKLIST = '/tasklist';
  const DB_TASKS = '/tasks';
  const DB_TASKLIST_ARCHIVE = '/tasklistarchive';

  //navigate
  const navigate = useNavigate();

  //user
  const { currentUser } = useAuth();

  //translation
  const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

  //states
  const [loading, setLoading] = useState(true);
  const [showAddTaskList, setShowAddTaskList] = useState(false);
  const [taskLists, setTaskLists] = useState();
  const [originalTaskLists, setOriginalTaskLists] = useState();

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      await fetchTaskListsFromFireBase();
    }
    getTaskLists();
  }, [])

  /* Fetch Task Lists From Firebase */
  const fetchTaskListsFromFireBase = async () => {
    const dbref = ref(db, DB_TASKLISTS);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      for (let id in snap) {
        fromDB.push({ id, ...snap[id] });
      }
      setLoading(false);
      setTaskLists(fromDB);
      setOriginalTaskLists(fromDB);
    })
  }

  /** Add Task List To Firebase */
  const addTaskList = async (taskList) => {
    taskList["created"] = getCurrentDateAsJson();
    taskList["createdBy"] = currentUser.email;
    const dbref = ref(db, DB_TASKLISTS);
    push(dbref, taskList)
      .then((snap) => {
        const key = snap.key;
        navigate(`${DB_TASKLIST}/${key}`);
      })
  }

  /** Delete Task List From Firebase */
  const deleteTaskList = async (id) => {
    //delete tasks
    const dbrefTasks = ref(db, `${DB_TASKS}/${id}`);
    remove(dbrefTasks);
    //delete task list
    const dbref = child(ref(db, DB_TASKLISTS), id);
    remove(dbref);
  }

  /** Navigate To Task List Archive */
  function gotoTaskListArchive() {
    navigate(DB_TASKLIST_ARCHIVE);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button
            color={showAddTaskList ? 'red' : 'green'}
            text={showAddTaskList ? t('button_close') : t('button_add_list')}
            onClick={() => setShowAddTaskList(!showAddTaskList)} />
          <Button text={t('button_goto_tasklist_archive')} color="#545454" onClick={() => gotoTaskListArchive()} />
        </ButtonGroup>
      </Row>
      <PageTitle title={t('manage_tasklists_title')} />
      {showAddTaskList && <AddTaskList onClose={() => setShowAddTaskList(false)} onAddTaskList={addTaskList} />}
      <div className="page-content">
        <SearchSortFilter
          useTitleFiltering={true}
          onSet={setTaskLists}
          showSortByTitle={true}
          showSortByCreatedDate={true}
          originalList={originalTaskLists} />
        {taskLists != null && taskLists.length > 0 ? (
          <TaskLists
            taskLists={taskLists}
            onDelete={deleteTaskList}
          />
        ) : (
          t('no_task_lists_to_show')
        )
        }
      </div>
    </div>
  )
}
