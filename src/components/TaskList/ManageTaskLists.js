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
//Icons
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SortMode = {
  None: "None",
  Name_ASC: "Name_ASC",
  Name_DESC: "Name_DESC",
  Created_ASC: "Created_ASC",
  Created_DESC: "Created_DESC",
}

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

  //sorting
  const [sortBy, setSortBy] = useState(SortMode.None);

  //search
  const [searchString, setSearchString] = useState('');

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      await fetchTaskListsFromFireBase();
    }
    getTaskLists();
  }, [])

  useEffect(() => {
    filterAndSort();
  }, [sortBy, searchString]);

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

  const filterAndSort = () => {
    if (!originalTaskLists) {
      return;
    }
    let newTaskLists = originalTaskLists;
    //haut
    if (searchString !== "") {
      newTaskLists = newTaskLists.filter(taskList => taskList.title.toLowerCase().includes(searchString.toLowerCase()));
    }
    //filtterit: TODO
    //sortit
    if (sortBy === SortMode.Name_ASC || sortBy === SortMode.Name_DESC) {
      newTaskLists = [...newTaskLists].sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
      if (sortBy === SortMode.Name_DESC) {
        newTaskLists.reverse();
      }
    } else if (sortBy === SortMode.Created_ASC || sortBy === SortMode.Created_DESC) {
      newTaskLists = [...newTaskLists].sort(
        (a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0)
      );
      if (sortBy === SortMode.Created_DESC) {
        newTaskLists.reverse();
      }
    }
    setTaskLists(newTaskLists);
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
      <h3 className="page-title">{t('manage_tasklists_title')}</h3>
      {showAddTaskList && <AddTaskList onClose={() => setShowAddTaskList(false)} onAddTaskList={addTaskList} />}
      <div className="page-content">
        <Form className='form-no-paddings'>
          <Form.Group as={Row}>
            <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
            <Col xs={9} sm={10}>
              <Button onClick={() => {
                sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
              }} text={t('created_date')} type="button" />
              {
                sortBy === SortMode.Created_DESC ? <FaArrowDown /> : ''
              }
              {
                sortBy === SortMode.Created_ASC ? <FaArrowUp /> : ''
              }
              &nbsp;
              <Button onClick={() => {
                sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
              }
              }
                text={t('name')} type="button"
              />
              {
                sortBy === SortMode.Name_DESC ? <FaArrowDown /> : ''
              }
              {
                sortBy === SortMode.Name_ASC ? <FaArrowUp /> : ''
              }
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
            <Col xs={9} sm={10}>
              <Form.Control
                autoComplete="off"
                type="text"
                id="inputSearchString"
                aria-describedby="searchHelpBlock"
                onChange={(e) => setSearchString(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Form>
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
