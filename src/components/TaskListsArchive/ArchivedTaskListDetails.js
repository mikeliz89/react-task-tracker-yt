import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accordion, Table, Row, Col, ButtonGroup } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, onValue, child } from 'firebase/database';
import Tasks from '../../components/Task/Tasks';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import { getFromFirebaseById, pushToFirebase, updateToFirebase, updateToFirebaseById } from '../../datatier/datatier';
import { getPageTitleContent } from '../../utils/ListUtils';

export default function ArchivedTaskListDetails() {

  //params
  const params = useParams();

  //states
  const [loading, setLoading] = useState(true);
  const [taskList, setTaskList] = useState({});
  const [originalTasks, setOriginalTasks] = useState();
  const [tasks, setTasks] = useState();
  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);

  //navigate
  const navigate = useNavigate();

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

  //load data
  useEffect(() => {
    let cancel = false;

    //Tasks
    const getTasks = async () => {
      if (cancel) {
        return;
      }
      await fetchTasksFromFirebase();
    }
    getTasks();

    const getTaskList = async () => {
      if (cancel) {
        return;
      }
      await fetchTaskListFromFirebase();
    }
    getTaskList();

    return () => {
      cancel = true;
    }
  }, [])

  const fetchTaskListFromFirebase = async () => {
    const dbref = ref(db, `${Constants.DB_TASKLIST_ARCHIVE}/${params.id}`);
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        navigate('/');
      }
      setTaskList(data);
      setLoading(false);
    })
  }

  const fetchTasksFromFirebase = async () => {
    const dbref = await child(ref(db, Constants.DB_TASKLIST_ARCHIVE_TASKS), params.id);
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
      setOriginalTasks(fromDB);
      setTaskCounter(taskCounterTemp);
      setTaskReadyCounter(taskReadyCounterTemp);
    })
  }

  const returnFromArchive = async () => {
    //1. add this tasklist-archive to taskLists
    taskList["archived"] = "";
    taskList["archivedBy"] = "";

    let taskListID = await pushToFirebase(Constants.DB_TASKLISTS, taskList);

    const archiveTaskListID = params.id;

    //2. delete old archived task lists
    getFromFirebaseById(Constants.DB_TASKLIST_ARCHIVE, archiveTaskListID).then((val) => {
      updateToFirebaseById(Constants.DB_TASKLIST_ARCHIVE, archiveTaskListID, null);
    })

    //3. delete old archived tasks, create new tasklist-tasks
    getFromFirebaseById(Constants.DB_TASKLIST_ARCHIVE_TASKS, archiveTaskListID).then((val) => {
      let updates = {};
      updates[`${Constants.DB_TASKLIST_ARCHIVE_TASKS}/${archiveTaskListID}`] = null;
      updates[`${Constants.DB_TASKS}/${taskListID}`] = val;
      updateToFirebase(updates);
    });
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button color="#545454" iconName={Constants.ICON_ARCHIVE}
            onClick={() => {
              if (window.confirm(t('return_from_archive_list_confirm_message'))) {
                returnFromArchive(taskList);
              }
            }}
          />
        </ButtonGroup>
      </Row>

      {/* TODO: Arkistoidun listan palautustoiminto -nappi */}
      <Row>
        <Col>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>
                <PageTitle title={taskList.title} iconName={Constants.ICON_LIST_ALT} />
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
                    <tr>
                      <td>{t('category')}</td>
                      <td>{t(getPageTitleContent(taskList.listType))}</td>
                    </tr>
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      {tasks != null && tasks.length > 0 ? (
        <>
          <Counter list={tasks} originalList={originalTasks} counter={taskCounter} />
          <Tasks
            archived={true}
            taskListID={params.id}
            tasks={tasks}
          />
        </>
      ) : (
        <>
          <CenterWrapper>
            {t('no_tasks_to_show')}
          </CenterWrapper>
        </>
      )}
    </PageContentWrapper>
  )
}
