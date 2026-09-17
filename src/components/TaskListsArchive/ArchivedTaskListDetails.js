import i18n from "i18next";
import { useState, useEffect } from 'react';
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Tasks from '../../components/Task/Tasks';
import { getFromFirebaseById, pushToFirebase, subscribeToFirebaseChildAsArray, updateToFirebase, updateToFirebaseById } from '../../datatier/datatier';
import { ICONS, TRANSLATION, DB, COLORS } from '../../utils/Constants';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getPageTitleContent, getManagePageByListType } from '../../utils/ListUtils';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import useFetch from '../Hooks/useFetch';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

export default function ArchivedTaskListDetails() {

  //navigate
  const navigate = useNavigate();

  //params
  const params = useParams();

  //states
  const [originalTasks, setOriginalTasks] = useState();
  const [tasks, setTasks] = useState();
  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);

  //translation
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //fetch data
  const { data: taskList, loading } = useFetch(DB.TASKLIST_ARCHIVE, "", params.id);

  //load data
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseChildAsArray(DB.TASKLIST_ARCHIVE_TASKS, params.id, (fromDB) => {
      let taskCounterTemp = 0;
      let taskReadyCounterTemp = 0;
      if (fromDB != null) {
        for (let i = 0; i < fromDB.length; i++) {
          taskCounterTemp++;
          if (fromDB[i]["reminder"] === true) {
            taskReadyCounterTemp++;
          }
        }
      }
      setTasks(fromDB);
      setOriginalTasks(fromDB);
      setTaskCounter(taskCounterTemp);
      setTaskReadyCounter(taskReadyCounterTemp);
    });

    return () => {
      unsubscribe();
    };
  }, [params.id])

  const returnFromArchive = async () => {
    //1. add this tasklist-archive to taskLists
    taskList["archived"] = "";
    taskList["archivedBy"] = "";

    let taskListID = await pushToFirebase(DB.TASKLISTS, taskList);

    const archiveTaskListID = params.id;

    //2. delete old archived task lists
    getFromFirebaseById(DB.TASKLIST_ARCHIVE, archiveTaskListID).then((val) => {
      updateToFirebaseById(DB.TASKLIST_ARCHIVE, archiveTaskListID, null);
    })

    //3. delete old archived tasks, create new tasklist-tasks
    getFromFirebaseById(DB.TASKLIST_ARCHIVE_TASKS, archiveTaskListID).then((val) => {
      let updates = {};
      updates[`${DB.TASKLIST_ARCHIVE_TASKS}/${archiveTaskListID}`] = null;
      updates[`${DB.TASKS}/${taskListID}`] = val;
      updateToFirebase(updates);
    });

    navigate(getManagePageByListType(taskList), { replace: true });
  }

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button color={COLORS.BUTTON_GRAY} iconName={ICONS.ARCHIVE}
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
          <PageTitle title={taskList.title} iconName={ICONS.LIST_ALT} />
          <p className="detailspage-summary">{`${t('description')}: ${taskList?.description || '-'}`}</p>
          <div className="detailspage-meta-row">
            <span className="detailspage-meta-history-icon">
              <Icon name={ICONS.HISTORY} color="#8f9bb3" fontSize="0.95rem" />
            </span>
            <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(taskList?.created, i18n.language)}</span></>
            <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(taskList?.modified, i18n.language)}</span></>
            <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{taskList?.createdBy || '-'}</span></>
          </div>
          <div className="detailspage-meta-row">
            <><span className="detailspage-meta-label">{t('tasks_ready_counter')}:</span> <span className="detailspage-meta-value">{taskReadyCounter}/{taskCounter}</span></>
            <><span className="detailspage-meta-label">{t('category')}:</span> <span className="detailspage-meta-value">{t(getPageTitleContent(taskList?.listType))}</span></>
          </div>
        </Col>
      </Row>

      <hr />

      {tasks != null && tasks.length > 0 ? (
        <Tasks
          archived={true}
          taskListID={params.id}
          items={tasks}
          originalList={originalTasks}
          counter={taskCounter}
        />
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



