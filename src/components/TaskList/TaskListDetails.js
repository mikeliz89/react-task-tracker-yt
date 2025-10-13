import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, ButtonGroup, Tab, Tabs, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddTask from '../Task/AddTask';
import AddTaskList from '../TaskList/AddTaskList';
import Tasks from '../Task/Tasks';
import ChangeType from './ChangeType';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue, child, get, off, push, update } from 'firebase/database';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { ICONS, DB, TRANSLATION, COLORS } from '../../utils/Constants';
import i18n from "i18next";
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import {
  removeFromFirebaseByIdAndSubId, pushToFirebaseChild, pushToFirebase,
  updateToFirebase, getFromFirebaseByIdAndSubId, getFromFirebaseById
} from '../../datatier/datatier';
import { getPageTitleContent, getManagePageByListType } from '../../utils/ListUtils';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import AccordionElement from '../AccordionElement';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';

export default function TaskListDetails() {

  //navigate
  const navigate = useNavigate();

  //params
  const params = useParams();
  const sourceListId = params.id;

  //translation
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //states
  const [tasks, setTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [tasklists, setTasklists] = useState([]); // [{id, title, ...}]
  const [destListId, setDestListId] = useState("");
  const [loadingMove, setLoadingMove] = useState(false);
  const [error, setError] = useState("");

  //modal & toggle
  const { status: showAddTask, toggleStatus: toggleAddTask } = useToggle();
  const { status: showEditTaskList, toggleStatus: toggleShowTaskList } = useToggle();
  const { status: showChangeListType, toggleStatus: toggleShowChangeListType } = useToggle();

  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);

  //user
  const { currentUser } = useAuth();

  //fetch data
  const { data: taskList, loading } = useFetch(DB.TASKLISTS, "", params.id);

  // --- Lataa nykyisen listan taskit ---
  useEffect(() => {
    const dbref = child(ref(db, DB.TASKS), sourceListId);
    const unsub = onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      let taskCounterTemp = 0;
      let taskReadyCounterTemp = 0;
      if (snap) {
        for (const id in snap) {
          taskCounterTemp++;
          if (snap[id]["reminder"] === true) {
            taskReadyCounterTemp++;
          }
          fromDB.push({ id, ...snap[id] });
        }
      }
      // säilytä valinnat, jotka vielä löytyvät
      setTasks(fromDB);
      setOriginalTasks(fromDB);
      setTaskCounter(taskCounterTemp);
      setTaskReadyCounter(taskReadyCounterTemp);
      setSelectedIds((prev) => new Set([...prev].filter((id) => snap?.[id])));
    });

    return () => {
      off(dbref); // siivoa kuuntelija
    };
  }, [sourceListId]);

  // --- Lataa kaikki tasklistat (kohdevalikkoa varten) ---
  useEffect(() => {
    const tlRef = ref(db, DB.TASKLISTS);
    // kertalataus riittää
    get(tlRef).then((snapshot) => {
      const v = snapshot.val() || {};
      const arr = Object.entries(v).map(([id, data]) => ({ id, ...data }));
      setTasklists(arr);
    });
  }, []);

  // Map-id → task nopeaan hakuun
  const tasksById = useMemo(() => {
    const m = new Map();
    tasks.forEach((t) => m.set(t.id, t));
    return m;
  }, [tasks]);

  const allSelected = tasks.length > 0 && selectedIds.size === tasks.length;

  // Valinnan togglaus yksittäiselle taskille
  const toggleSelect = (taskId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  // Valitse kaikki
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    }
  };

  //tyhjennä valinnat
  const clearSelection = () => setSelectedIds(new Set());

  // Järjestys: 1) listType (nouseva), 2) title aakkosissa
  const sortByTypeThenTitle = (a, b) => {
    // varmista että listType on numero; jos puuttuu → menee viimeiseksi
    const ta = Number.isFinite(+a.listType) ? +a.listType : Number.POSITIVE_INFINITY;
    const tb = Number.isFinite(+b.listType) ? +b.listType : Number.POSITIVE_INFINITY;

    if (ta !== tb) return ta - tb;

    const titleA = (a.title ?? "").toString();
    const titleB = (b.title ?? "").toString();

    // aakkosjärjestys suomeksi, kirjainkoko neutraali
    return titleA.localeCompare(titleB, "fi", { sensitivity: "base" });
  };

  // ...
  const destinationOptions = tasklists
    .filter((t) => t.id !== sourceListId)
    .slice() // kopio, ettei mutatoida alkuperäistä
    .sort(sortByTypeThenTitle);
  const canMove = selectedIds.size > 0 && destListId && !loadingMove;

  // Siirtologiikka (atominen update)
  const handleMove = async () => {
    setError("");
    if (!canMove) return;
    setLoadingMove(true);
    try {
      // Rakennetaan atominen päivitys
      const rootRef = ref(db); // käytetään juurta, jotta voidaan päivittää monia polkuja kerralla
      const updates = {};

      // Kopioidaan jokainen valittu task kohteeseen uudella avaimella ja poistetaan lähteestä
      selectedIds.forEach((taskId) => {
        const taskData = tasksById.get(taskId);
        if (!taskData) return;

        // luodaan uusi avain kohteeseen
        const newKey = push(child(ref(db), `${DB.TASKS}/${destListId}`)).key;

        // poista id kenttä taskDatasta
        const { id: _omit, ...payload } = taskData; // ⬅️ tässä id pudotetaan pois

        // (valinnainen) lisää metadataa
        // payload.movedAt = new Date().toISOString();

        updates[`${DB.TASKS}/${destListId}/${newKey}`] = payload;
        updates[`${DB.TASKS}/${sourceListId}/${taskId}`] = null; // poista lähteestä
      });

      await update(rootRef, updates);

      // Optimistinen UI: tyhjennä valinnat ja kohde
      clearSelection();
      setDestListId("");
    } catch (e) {
      console.error(e);
      setError("Siirto epäonnistui. Yritä uudelleen.");
    } finally {
      setLoadingMove(false);
    }
  };

  const updateTask = async (taskListID, task) => {
    task["created"] = getCurrentDateAsJson();
    task["createdBy"] = currentUser.email;
    pushToFirebaseChild(DB.TASKS, taskListID, task);
  }

  const deleteTask = async (taskListID, id) => {
    removeFromFirebaseByIdAndSubId(DB.TASKS, taskListID, id);
  }

  const toggleReminder = async (taskListID, id) => {
    getFromFirebaseByIdAndSubId(DB.TASKS, taskListID, id).then((val) => {
      const updates = {};
      const oldReminder = val["reminder"];
      updates[`${DB.TASKS}/${taskListID}/${id}/reminder`] = !oldReminder;
      updateToFirebase(updates);
    });
  }

  const markAllTasksDone = async (taskListID) => {
    const dbref = child(ref(db, DB.TASKS), taskListID);
    get(dbref).then((snapshot) => {
      if (snapshot.exists()) {
        //update each snapshot data separately (child)
        snapshot.forEach((data) => {
          const updates = {};
          updates[`${DB.TASKS}/${taskListID}/${data.key}/reminder`] = true;
          updateToFirebase(updates);
        });
      } else {
        console.log("No data available");
      }
    });
  }

  const updateTaskList = async (taskList) => {
    var taskListID = params.id;
    if (taskList["listType"] === undefined || taskList["listType"] === 0) {
      delete taskList["listType"];
    }
    taskList["modified"] = getCurrentDateAsJson();
    const updates = {};
    updates[`${DB.TASKLISTS}/${taskListID}`] = taskList;
    updateToFirebase(updates);
  }

  async function archiveTaskList(taskList) {
    //1. add this taskList to tasklist-archive
    taskList["archived"] = getCurrentDateAsJson();
    taskList["archivedBy"] = currentUser.email;

    let archiveTaskListID = await pushToFirebase(DB.TASKLIST_ARCHIVE, taskList);

    const taskListID = params.id;

    //2. delete old task lists
    getFromFirebaseById(DB.TASKLISTS, taskListID).then((val) => {
      let updates = {};
      updates[`${DB.TASKLISTS}/${taskListID}`] = null;
      updateToFirebase(updates);
    })

    //3. delete old tasks, create new tasklist-archive-tasks
    getFromFirebaseById(DB.TASKS, taskListID).then((val) => {
      let updates = {};
      updates[`${DB.TASKS}/${taskListID}`] = null;
      updates[`${DB.TASKLIST_ARCHIVE_TASKS}/${archiveTaskListID}`] = val;
      updateToFirebase(updates);
    });

    // Ohjaa managetasklists-sivulle
    navigate(getManagePageByListType(taskList), { replace: true });
  }

  const addCommentToTaskList = async (comment) => {
    const taskListID = params.id;
    comment["created"] = getCurrentDateAsJson()
    comment["createdBy"] = currentUser.email;
    comment["creatorUserID"] = currentUser.uid;
    pushToFirebaseChild(DB.TASKLIST_COMMENTS, taskListID, comment);
  }

  const addLinkToTaskList = (link) => {
    const taskListID = params.id;
    link["created"] = getCurrentDateAsJson();
    pushToFirebaseChild(DB.TASKLIST_LINKS, taskListID, link);
  }

  const copyToClipboard = () => {
    let text = "";
    tasks.forEach(function (arrayItem) {
      text += "*" + arrayItem.text.trim() + "*";
      if (arrayItem.day) {
        text += ": " + arrayItem.day;
      }
      if (arrayItem.reminder) {
        text += ` [x]`;
      } else {
        text += ` [ ]`;
      }
      text += "\n";
    });
    navigator.clipboard.writeText(text);
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
      {/* <pre>{JSON.stringify(taskList)}</pre> */}
      <Row>
        <ButtonGroup aria-label="Button group">
          <GoBackButton />
          <Button
            iconName={ICONS.EDIT}
            text={showEditTaskList ? tCommon('buttons.button_close') : ''}
            color={showEditTaskList ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
            onClick={() => toggleShowTaskList()}
          />
          <Button color={COLORS.BUTTON_GRAY} iconName={ICONS.ARCHIVE}
            onClick={() => {
              if (window.confirm(t('archive_list_confirm_message'))) {
                archiveTaskList(taskList);
              }
            }}
          />
        </ButtonGroup>
      </Row>

      <AccordionElement array={getAccordionData()} title={taskList.title}
        iconName={ICONS.LIST_ALT} />

      <Row>
        <Col>
          {t('description') + ': '}{taskList.description}
        </Col>
      </Row>

      {
        showChangeListType &&
        <ChangeType taskList={taskList}
          onSave={updateTaskList}
          onClose={() => toggleShowChangeListType()} />
      }

      <Modal show={showEditTaskList} onHide={toggleShowTaskList}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal_header_edit_task_list')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTaskList onSave={updateTaskList}
            taskListID={params.id} onClose={toggleShowTaskList}
          />
        </Modal.Body>
      </Modal>

      <Tabs defaultActiveKey="home"
        id="taskListDetails-Tab"
        className="mb-3">
        <Tab eventKey="home" title={t('tabheader_tasks')}>

          {
            originalTasks != null && originalTasks.length > 0 ? (
              <SearchSortFilter
                onSet={setTasks}
                originalList={originalTasks}
                //search
                showSearchByText={true}
                showSearchByDay={true}
                //sort
                showSortByText={true}
                showSortByCreatedDate={true}
                //filter
                filterMode={FilterMode.Text}
                showFilterReady={true}
                showFilterNotReady={true}
              />
            ) : (<></>)
          }

          <CenterWrapper>
            <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')}
              iconName={ICONS.COPY} />
            &nbsp;
            <Button
              iconName={ICONS.PLUS}
              color={showAddTask ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
              text={showAddTask ? tCommon('buttons.button_close') : t('button_add_task')}
              onClick={toggleAddTask} />
          </CenterWrapper>

          <Modal show={showAddTask} onHide={toggleAddTask}>
            <Modal.Header closeButton>
              <Modal.Title>{t('modal_header_add_task')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddTask
                onClose={toggleAddTask}
                taskListID={params.id} onSave={updateTask}
              />
            </Modal.Body>
          </Modal>

          {/* Työkalupalkki */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <button onClick={toggleAll} disabled={tasks.length === 0}>
              {allSelected ? "Poista kaikki valinnat" : "Valitse kaikki"}
            </button>
            <button onClick={clearSelection} disabled={selectedIds.size === 0}>
              Tyhjennä valinnat
            </button>

            <select
              value={destListId}
              onChange={(e) => setDestListId(e.target.value)}
              style={{ minWidth: 220 }}
            >
              <option value="">— Valitse kohdelista —</option>
              {destinationOptions.map((tl) => (
                <option key={tl.id} value={tl.id}>
                  {/* esim. "8 — Retkeilyideat 2022" */}
                  {(Number.isFinite(+tl.listType) ? `${+tl.listType} — ` : "") + (tl.title || tl.id)}
                </option>
              ))}
            </select>

            <button onClick={handleMove} disabled={!canMove}>
              {loadingMove ? "Siirretään..." : `Siirrä valitut (${selectedIds.size})`}
            </button>
          </div>

          {tasks != null && tasks.length > 0 ? (
            <>
              <Counter list={tasks} originalList={originalTasks} counter={taskCounter} text={t('tasks')} />
              <Tasks
                taskListID={params.id}
                tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder}
                selectedIds={selectedIds}
                onSelectToggle={toggleSelect}
              />
            </>
          ) : (
            <>
              <CenterWrapper>
                {t('no_tasks_to_show')}
              </CenterWrapper>
            </>
          )}
        </Tab>
        <Tab eventKey="links" title={t('tabheader_links')}>
          <LinkComponent objID={params.id} url={DB.TASKLIST_LINKS} onSaveLink={addLinkToTaskList} />
        </Tab>
        <Tab eventKey="comments" title={t('tabheader_comments')}>
          <CommentComponent objID={params.id} url={DB.TASKLIST_COMMENTS} onSave={addCommentToTaskList} />
        </Tab>
        <Tab eventKey="actions" title={t('tabheader_actions')}>
          <div style={{ marginBottom: '10px' }}>
            <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')} iconName={ICONS.COPY} /> &nbsp;
            <Button onClick={() => {
              if (window.confirm(t('mark_all_tasks_done_confirm_message'))) {
                markAllTasksDone(params.id)
              }
            }} text={t('mark_all_tasks_done')} iconName={ICONS.SQUARE_CHECK} /> &nbsp;
            <Button onClick={() => toggleShowChangeListType()} text={t('change_list_type')}
              iconName={ICONS.EDIT} />
          </div>
        </Tab>
      </Tabs>

      <Row />

    </PageContentWrapper>
  )
}
