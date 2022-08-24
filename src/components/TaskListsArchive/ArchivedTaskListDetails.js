//react
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accordion, Table, Row, Col } from 'react-bootstrap';
//firebase
import { ref, onValue, child } from "firebase/database";
import { db } from '../../firebase-config';
//tasks
import Tasks from '../../components/Task/Tasks';
//buttons
import GoBackButton from '../GoBackButton';
//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//pagetitle
import PageTitle from '../PageTitle';

export default function ArchivedTaskListDetails() {

  const DB_TASKLIST_ARCHIVE = '/tasklist-archive';
  const DB_TASKLIST_ARCHIVE_TASKS = '/tasklist-archive-tasks';

  //params
  const params = useParams();

  //states
  const [loading, setLoading] = useState(true);
  const [taskList, setTaskList] = useState({});
  const [tasks, setTasks] = useState();
  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);

  //navigate
  const navigate = useNavigate();

  //translation
  const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

  //load data
  useEffect(() => {
    let cancel = false;

    //Tasks
    const getTasks = async () => {
      if (cancel) {
        return;
      }
      await fetchTasksFromFirebase()
    }
    getTasks()

    const getTaskList = async () => {
      if (cancel) return;
      await fetchTaskListFromFirebase()
    }
    getTaskList()

    return () => {
      cancel = true;
    }
  }, [])

  /** Fetch Task List From Firebase */
  const fetchTaskListFromFirebase = async () => {
    const dbref = ref(db, `${DB_TASKLIST_ARCHIVE}/${params.id}`);
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        navigate('/')
      }
      setTaskList(data)
      setLoading(false);
    })
  }

  /** Fetch Tasks From Database */
  const fetchTasksFromFirebase = async () => {
    const dbref = await child(ref(db, DB_TASKLIST_ARCHIVE_TASKS), params.id);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      let taskCounterTemp = 0;
      let taskReadyCounterTemp = 0;
      for (let id in snap) {
        taskCounterTemp++;
        if (snap[id]["reminder"] === true) {
          taskReadyCounterTemp++;
        }
        fromDB.push({ id, ...snap[id] });
      }
      setTasks(fromDB);
      setTaskCounter(taskCounterTemp);
      setTaskReadyCounter(taskReadyCounterTemp);
    })
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <div>
      <GoBackButton />
      {/* TODO: Arkistoidun listan palautustoiminto -nappi */}
      <Row>
        <Col>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>
                <PageTitle title={taskList.title} iconName='list-alt' />
              </Accordion.Header>
              <Accordion.Body>
                {t('description')}: {taskList.description}<br />
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td>{t('created')}</td>
                      <td>{getJsonAsDateTimeString(taskList.created, i18n.language)}</td>
                    </tr>
                    <tr>
                      <td>{t('created_by')}</td>
                      <td>{taskList.createdBy}</td>
                    </tr>
                    <tr>
                      <td>{t('modified')}</td>
                      <td>{getJsonAsDateTimeString(taskList.modified, i18n.language)}</td>
                    </tr>
                    <tr>
                      <td>{t('tasks_ready_counter')}</td>
                      <td>{taskReadyCounter}/{taskCounter}</td>
                    </tr>
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <div className="page-content">
        {tasks != null && tasks.length > 0 ? (
          <Tasks
            archived={true}
            taskListID={params.id}
            tasks={tasks}
          />
        ) : (
          t('no_tasks_to_show')
        )}
      </div>
    </div>
  )
}
