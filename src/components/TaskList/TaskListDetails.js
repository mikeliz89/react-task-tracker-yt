import { useEffect, useMemo, useState } from 'react';
import i18n from 'i18next';
import { child, get, off, onValue, push, ref, update } from 'firebase/database';
import { ButtonGroup, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import {
  getFromFirebaseById,
  getFromFirebaseByIdAndSubId,
  pushToFirebase,
  pushToFirebaseChild,
  removeFromFirebaseByIdAndSubId,
  updateToFirebase
} from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { COLORS, DB, ICONS, TRANSLATION } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getManagePageByListType, getPageTitleContent } from '../../utils/ListUtils';

import AccordionElement from '../AccordionElement';
import Button from '../Buttons/Button';
import CommentComponent from '../Comments/CommentComponent';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import LinkComponent from '../Links/LinkComponent';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import PageContentWrapper from '../Site/PageContentWrapper';
import Icon from '../Icon';
import AddTask from '../Task/AddTask';
import Tasks from '../Task/Tasks';
import AddTaskList from '../TaskList/AddTaskList';
import GoBackButton from '../Buttons/GoBackButton';
import ChangeType from './ChangeType';

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
  const canDeleteSelected = selectedIds.size > 0 && !loadingMove;

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
    } catch (ex) {
      setError("Siirto epäonnistui. Yritä uudelleen.");
      console.warn(ex);
    } finally {
      setLoadingMove(false);
    }
  };

  const handleDeleteSelected = async () => {
    setError("");
    if (!canDeleteSelected) return;
    if (!window.confirm(tCommon('confirm.areyousure'))) return;

    setLoadingMove(true);
    try {
      const rootRef = ref(db);
      const updates = {};

      selectedIds.forEach((taskId) => {
        updates[`${DB.TASKS}/${sourceListId}/${taskId}`] = null;
      });

      await update(rootRef, updates);
      clearSelection();
    } catch (ex) {
      setError("Poisto epäonnistui. Yritä uudelleen.");
      console.warn(ex);
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

  const markAllTasksUndone = async (taskListID) => {
    const dbref = child(ref(db, DB.TASKS), taskListID);
    get(dbref).then((snapshot) => {
      if (snapshot.exists()) {
        //update each snapshot data separately (child)
        snapshot.forEach((data) => {
          const updates = {};
          updates[`${DB.TASKS}/${taskListID}/${data.key}/reminder`] = false;
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

  const toolsMenu = (
    <details style={{ marginBottom: 12 }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: 8 }}>
        {t('tabheader_actions')}
      </summary>

      <div style={{ marginBottom: '10px' }}>
        <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')} iconName={ICONS.COPY} /> &nbsp;
        <Button
          iconName={ICONS.PLUS}
          color={showAddTask ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
          text={showAddTask ? tCommon('buttons.button_close') : t('button_add_task')}
          onClick={toggleAddTask}
        /> &nbsp;
        <Button onClick={() => {
          if (window.confirm(t('mark_all_tasks_done_confirm_message'))) {
            markAllTasksDone(params.id)
          }
        }} text={t('mark_all_tasks_done')} iconName={ICONS.SQUARE_CHECK} /> &nbsp;
        <Button onClick={() => {
          if (window.confirm(t('mark_all_tasks_undone_confirm_message'))) {
            markAllTasksUndone(params.id)
          }
        }} text={t('mark_all_tasks_undone')} iconName={ICONS.HOURGLASS_1} /> &nbsp;
        <Button onClick={() => toggleShowChangeListType()} text={t('change_list_type')}
          iconName={ICONS.EDIT} />
      </div>

      {
        showChangeListType &&
        <ChangeType taskList={taskList}
          onSave={updateTaskList}
          onClose={() => toggleShowChangeListType()} />
      }

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: 8,
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <button onClick={toggleAll} disabled={tasks.length === 0}>
          {allSelected ? t('toolbar_unselect_all') : t('toolbar_select_all')}
        </button>

        <Button
          onClick={handleDeleteSelected}
          disabled={!canDeleteSelected}
          color={COLORS.DELETEBUTTON}
          iconName={ICONS.DELETE}
          text={`${t('toolbar_delete_selected')} (${selectedIds.size})`}
        />

        <span style={{ fontWeight: 600 }}>
          {t('toolbar_move_to_another_list')}
        </span>

        <select
          value={destListId}
          onChange={(e) => setDestListId(e.target.value)}
          style={{ minWidth: 220 }}
        >
          <option value="">{t('toolbar_select_destination_list')}</option>
          {destinationOptions.map((tl) => (
            <option key={tl.id} value={tl.id}>
              {`${Number.isFinite(+tl.listType) ? t(getPageTitleContent(tl.listType)) : t('manage_tasklists_title')} — ${tl.title || tl.id}`}
            </option>
          ))}
        </select>

        <button onClick={handleMove} disabled={!canMove}>
          {loadingMove ? t('toolbar_moving') : `${t('toolbar_move_selected_to_another_list')} (${selectedIds.size})`}
        </button>
      </div>
    </details>
  );

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

      <Modal show={showAddTask} onHide={toggleAddTask}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal_header_add_task')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTask
            onClose={toggleAddTask}
            taskListID={params.id} onSave={updateTask}
            autoFocusText={true}
          />
        </Modal.Body>
      </Modal>

      <Tabs defaultActiveKey="home"
        id="taskListDetails-Tab"
        className="mb-3">
        <Tab eventKey="home" title={<><Icon name={ICONS.LIST_ALT} />{t('tabheader_tasks')}</>}>

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
              />
            ) : (<></>)
          }

          {toolsMenu}

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
        <Tab eventKey="links" title={<><Icon name={ICONS.EXTERNAL_LINK_ALT} />{t('tabheader_links')}</>}>
          <LinkComponent objID={params.id} url={DB.TASKLIST_LINKS} onSaveLink={addLinkToTaskList} />
        </Tab>
        <Tab eventKey="comments" title={<><Icon name={ICONS.COMMENTS} />{t('tabheader_comments')}</>}>
          <CommentComponent objID={params.id} url={DB.TASKLIST_COMMENTS} onSave={addCommentToTaskList} />
        </Tab>
      </Tabs>

      <Row />

    </PageContentWrapper>
  )
}
