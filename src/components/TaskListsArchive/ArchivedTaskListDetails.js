import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, onValue, child } from 'firebase/database';
import Tasks from '../../components/Task/Tasks';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import { getFromFirebaseById, pushToFirebase, updateToFirebase, updateToFirebaseById } from '../../datatier/datatier';
import { getPageTitleContent } from '../../utils/ListUtils';
import AccordionElement from '../AccordionElement';
import useFetch from '../useFetch';

export default function ArchivedTaskListDetails() {

  //params
  const params = useParams();

  //states
  const [originalTasks, setOriginalTasks] = useState();
  const [tasks, setTasks] = useState();
  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);

  //translation
  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_TASKLIST });
  const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

  //fetch data
  const { data: taskList, loading } = useFetch(Constants.DB_TASKLIST_ARCHIVE, "", params.id);

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

    return () => {
      cancel = true;
    }
  }, [])


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

  const getAccordionData = () => {
    return [
      { id: 1, name: t('created'), value: getJsonAsDateTimeString(taskList.created, i18n.language) },
      { id: 2, name: t('created_by'), value: taskList.createdBy },
      { id: 3, name: t('modified'), value: getJsonAsDateTimeString(taskList.modified, i18n.language) },
      { id: 4, name: t('tasks_ready_counter'), value: taskReadyCounter + '/' + taskCounter },
      { id: 5, name: t('category'), value: t(getPageTitleContent(taskList.listType)) }
    ];
  }

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button color={Constants.COLOR_BUTTON_GRAY} iconName={Constants.ICON_ARCHIVE}
            onClick={() => {
              if (window.confirm(t('return_from_archive_list_confirm_message'))) {
                returnFromArchive(taskList);
              }
            }}
          />
        </ButtonGroup>
      </Row>

      {/* TODO: Arkistoidun listan palautustoiminto -nappi */}

      <AccordionElement array={getAccordionData()} title={taskList.title} iconName={Constants.ICON_LIST_ALT} forceOpen={true} />

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
