//params
import i18n from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Col, Dropdown, DropdownButton, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import {
  createFirebaseChildKey,
  getFromFirebaseAsArray,
  getFromFirebaseById,
  getFromFirebaseByIdAndSubId,
  getFromFirebaseChildAsArray,
  pushToFirebase,
  pushToFirebaseChild,
  removeFromFirebaseByIdAndSubId,
  subscribeToFirebaseChildAsArray,
  updateToFirebase
} from '../../datatier/datatier';
import { COLORS, DB, ICONS, TRANSLATION } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getManagePageByListType, getPageTitleContent } from '../../utils/ListUtils';
import Button from '../Buttons/Button';
import CopyToClipboardButton from '../Buttons/CopyToClipboardButton';
import GoBackButton from '../Buttons/GoBackButton';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import Icon from '../Icon';
import LinkComponent from '../Links/LinkComponent';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import AddTask from '../Task/AddTask';
import Tasks from '../Task/Tasks';
import AddTaskList from '../TaskList/AddTaskList';

import ChangeType from './ChangeType';
import { SortMode } from '../SearchSortFilter/SortModes';
import { ListTypes } from '../../utils/Enums';

export default function TaskListDetails() {

  //navigate
  const navigate = useNavigate();

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
  const { status: showBulkAddTasks, toggleStatus: toggleBulkAddTasks } = useToggle();
  const { status: showEditTaskList, toggleStatus: toggleShowTaskList } = useToggle();
  const { status: showChangeListType, toggleStatus: toggleShowChangeListType } = useToggle();
  const { status: showMoveToAnotherList, toggleStatus: toggleShowMoveToAnotherList } = useToggle();
  const [bulkTasksText, setBulkTasksText] = useState('');

  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);

  //user
  const { currentUser } = useAuth();

  //fetch data
  const { data: taskList, loading } = useFetch(DB.TASKLISTS, "", params.id);

  // --- Lataa nykyisen listan taskit ---
  useEffect(() => {
    const unsub = subscribeToFirebaseChildAsArray(DB.TASKS, sourceListId, (fromDB) => {
      let taskCounterTemp = 0;
      let taskReadyCounterTemp = 0;
      if (fromDB) {
        for (let i = 0; i < fromDB.length; i++) {
          taskCounterTemp++;
          if (fromDB[i]["reminder"] === true) {
            taskReadyCounterTemp++;
          }
        }
      }
      // säilytä valinnat, jotka vielä löytyvät
      setTasks(fromDB);
      setOriginalTasks(fromDB);
      setTaskCounter(taskCounterTemp);
      setTaskReadyCounter(taskReadyCounterTemp);
      const existingIds = new Set((fromDB || []).map((task) => task.id));
      setSelectedIds((prev) => new Set([...prev].filter((id) => existingIds.has(id))));
    });

    return () => {
      unsub();
    };
  }, [sourceListId]);

  // --- Lataa kaikki tasklistat (kohdevalikkoa varten) ---
  useEffect(() => {
    // kertalataus riittää
    getFromFirebaseAsArray(DB.TASKLISTS).then((arr) => {
      setTasklists(arr);
    });
  }, []);

  // Map-id → task nopeaan hakuun
  const tasksById = useMemo(() => {
    const m = new Map();
    tasks.forEach((t) => m.set(t.id, t));
    return m;
  }, [tasks]);

  const selectedTasks = useMemo(() => {
    return tasks.filter((task) => selectedIds.has(task.id));
  }, [tasks, selectedIds]);

  // Valinnan togglaus yksittäiselle taskille
  const toggleSelect = (taskId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  // Valitse kaikki
  const selectAll = () => {
    setSelectedIds(new Set(tasks.map((t) => t.id)));
  };

  // Valitse kaikki valmiit tehtävät
  const selectAllDone = () => {
    setSelectedIds(new Set(tasks.filter((t) => t.reminder === true).map((t) => t.id)));
  };

  // Poista valinnasta kaikki valmiit tehtävät
  const unselectAllDone = () => {
    const doneIds = new Set(tasks.filter((t) => t.reminder === true).map((t) => t.id));
    setSelectedIds((prev) => new Set([...prev].filter((id) => !doneIds.has(id))));
  };

  // Valitse kaikki keskeneraiset tehtävät
  const selectAllUndone = () => {
    setSelectedIds(new Set(tasks.filter((t) => t.reminder !== true).map((t) => t.id)));
  };

  // Poista valinnasta kaikki keskeneraiset tehtävät
  const unselectAllUndone = () => {
    const undoneIds = new Set(tasks.filter((t) => t.reminder !== true).map((t) => t.id));
    setSelectedIds((prev) => new Set([...prev].filter((id) => !undoneIds.has(id))));
  };

  //tyhjennä valinnat
  const clearSelection = () => setSelectedIds(new Set());

  // Järjestys: 1) listatyyppinimi (käännetty), 2) title aakkosissa
  const sortByTypeThenTitle = (a, b) => {
    const aTypeKey = Number.isFinite(+a.listType)
      ? getPageTitleContent(+a.listType)
      : 'manage_tasklists_title';
    const bTypeKey = Number.isFinite(+b.listType)
      ? getPageTitleContent(+b.listType)
      : 'manage_tasklists_title';

    const aTypeTitle = t(aTypeKey);
    const bTypeTitle = t(bTypeKey);
    const typeCompare = aTypeTitle.localeCompare(bTypeTitle, i18n.language || 'fi', { sensitivity: 'base' });

    if (typeCompare !== 0) return typeCompare;

    const titleA = (a.title ?? "").toString();
    const titleB = (b.title ?? "").toString();

    // aakkosjärjestys nykyisen i18n-kielen mukaan, kirjainkoko neutraali
    return titleA.localeCompare(titleB, i18n.language || 'fi', { sensitivity: "base" });
  };

  const getListTypeIconText = (listType) => {
    switch (Number(listType)) {
      case ListTypes.Car:
        return '🚗';
      case ListTypes.Food:
        return '🍽️';
      case ListTypes.Drink:
        return '🍸';
      case ListTypes.Programming:
        return '💻';
      case ListTypes.Music:
        return '🎵';
      case ListTypes.Games:
        return '🎮';
      case ListTypes.BoardGames:
        return '♟️';
      case ListTypes.Exercises:
        return '🏋️';
      case ListTypes.BackPacking:
        return '🏕️';
      case ListTypes.Shopping:
        return '🛒';
      case ListTypes.Movies:
        return '🎬';
      default:
        return '📋';
    }
  };

  // ...
  const destinationOptions = tasklists
    .filter((t) => t.id !== sourceListId)
    .slice() // kopio, ettei mutatoida alkuperäistä
    .sort(sortByTypeThenTitle);
  const hasSelection = selectedIds.size > 0;
  const canMove = selectedIds.size > 0 && destListId && !loadingMove;
  const canDeleteSelected = selectedIds.size > 0 && !loadingMove;

  // Siirtologiikka (atominen update)
  const handleMove = async () => {
    setError("");
    if (!canMove) return;
    setLoadingMove(true);
    try {
      // Rakennetaan atominen päivitys
      const updates = {};

      // Kopioidaan jokainen valittu task kohteeseen uudella avaimella ja poistetaan lähteestä
      selectedIds.forEach((taskId) => {
        const taskData = tasksById.get(taskId);
        if (!taskData) return;

        // luodaan uusi avain kohteeseen
        const newKey = createFirebaseChildKey(DB.TASKS, destListId);

        // poista id kenttä taskDatasta
        const { id: _omit, ...payload } = taskData; // ⬅️ tässä id pudotetaan pois

        // (valinnainen) lisää metadataa
        // payload.movedAt = new Date().toISOString();

        updates[`${DB.TASKS}/${destListId}/${newKey}`] = payload;
        updates[`${DB.TASKS}/${sourceListId}/${taskId}`] = null; // poista lähteestä
      });

      await updateToFirebase(updates);

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
      const updates = {};

      selectedIds.forEach((taskId) => {
        updates[`${DB.TASKS}/${sourceListId}/${taskId}`] = null;
      });

      await updateToFirebase(updates);
      clearSelection();
    } catch (ex) {
      setError("Poisto epäonnistui. Yritä uudelleen.");
      console.warn(ex);
    } finally {
      setLoadingMove(false);
    }
  };

  const handleMarkSelectedDone = async () => {
    setError("");
    if (!hasSelection || loadingMove) return;

    setLoadingMove(true);
    try {
      const updates = {};

      selectedIds.forEach((taskId) => {
        updates[`${DB.TASKS}/${sourceListId}/${taskId}/reminder`] = true;
      });

      if (Object.keys(updates).length > 0) {
        await updateToFirebase(updates);
      }
    } catch (ex) {
      setError("Merkkaus epäonnistui. Yritä uudelleen.");
      console.warn(ex);
    } finally {
      setLoadingMove(false);
    }
  };

  const handleMarkSelectedUndone = async () => {
    setError("");
    if (!hasSelection || loadingMove) return;

    setLoadingMove(true);
    try {
      const updates = {};

      selectedIds.forEach((taskId) => {
        updates[`${DB.TASKS}/${sourceListId}/${taskId}/reminder`] = false;
      });

      if (Object.keys(updates).length > 0) {
        await updateToFirebase(updates);
      }
    } catch (ex) {
      setError("Merkkaus epäonnistui. Yritä uudelleen.");
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

  const addBulkTasks = async () => {
    const names = bulkTasksText
      .split(/[\r\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      return;
    }

    await Promise.all(names.map((text) =>
      updateTask(params.id, { text, day: '', reminder: false })
    ));

    setBulkTasksText('');
    toggleBulkAddTasks();
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
    getFromFirebaseChildAsArray(DB.TASKS, taskListID).then((tasksFromDb) => {
      const updates = {};
      tasksFromDb.forEach((task) => {
        updates[`${DB.TASKS}/${taskListID}/${task.id}/reminder`] = true;
      });
      if (Object.keys(updates).length > 0) {
        updateToFirebase(updates);
      }
    });
  }

  const markAllTasksUndone = async (taskListID) => {
    getFromFirebaseChildAsArray(DB.TASKS, taskListID).then((tasksFromDb) => {
      const updates = {};
      tasksFromDb.forEach((task) => {
        updates[`${DB.TASKS}/${taskListID}/${task.id}/reminder`] = false;
      });
      if (Object.keys(updates).length > 0) {
        updateToFirebase(updates);
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

  const handleSelectionTools = (action) => {
    switch (action) {
      case 'all':
        selectAll();
        break;
      case 'clear':
        clearSelection();
        break;
      case 'select_done':
        selectAllDone();
        break;
      case 'unselect_done':
        unselectAllDone();
        break;
      case 'select_undone':
        selectAllUndone();
        break;
      case 'unselect_undone':
        unselectAllUndone();
        break;
      default:
        break;
    }
  };

  const handleSelectedTaskActions = (action) => {
    switch (action) {
      case 'selected_done':
        handleMarkSelectedDone();
        break;
      case 'selected_undone':
        handleMarkSelectedUndone();
        break;
      case 'selected_delete':
        handleDeleteSelected();
        break;
      default:
        break;
    }
  };


  // Custom formatter for tasks to clipboard
  const getTasksClipboardText = (items) => {
    let text = '';
    if (Array.isArray(items)) {
      items.forEach(function (arrayItem) {
        text += "*" + (arrayItem.text?.trim() || '') + "*";
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
    }
    return text;
  };

  const toolsMenu = (
    <details style={{ marginBottom: 12 }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: 8 }}>
        {t('tabheader_actions')}
      </summary>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{t('toolbar_list_tools')}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <CopyToClipboardButton
              items={tasks}
              getText={getTasksClipboardText}
              text={t('toolbar_copy_list')}
            />
            <CopyToClipboardButton
              items={selectedTasks}
              getText={getTasksClipboardText}
              text={t('toolbar_copy_selected')}
            />
            <Button onClick={() => toggleShowChangeListType()} text={t('change_list_type')}
              iconName={ICONS.EDIT} />
          </div>
        </div>

        {
          showChangeListType &&
          <ChangeType taskList={taskList}
            onSave={updateTaskList}
            onClose={() => toggleShowChangeListType()} />
        }

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{`${t('toolbar_selection_tools')} (${selectedIds.size}/${tasks.length} ${t('tasks')})`}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <DropdownButton
              id="selection-tools"
              variant="outline-secondary"
              title={t('toolbar_selection_tools')}
              disabled={tasks.length === 0}
            >
              <Dropdown.Item onClick={() => handleSelectionTools('all')}>
                {t('toolbar_select_all')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectionTools('clear')}>
                {t('toolbar_unselect_all')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectionTools('select_done')}>
                {t('toolbar_select_all_done')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectionTools('unselect_done')}>
                {t('toolbar_unselect_all_done')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectionTools('select_undone')}>
                {t('toolbar_select_all_undone')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectionTools('unselect_undone')}>
                {t('toolbar_unselect_all_undone')}
              </Dropdown.Item>
            </DropdownButton>
            <Button
              onClick={toggleShowMoveToAnotherList}
              disabled={!hasSelection || loadingMove}
              color={COLORS.BUTTON_GRAY}
              iconName={ICONS.LIST_ALT}
              text={t('toolbar_move_to_another_list')}
            />
          </div>

          {
            showMoveToAnotherList &&
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <select
                value={destListId}
                onChange={(e) => setDestListId(e.target.value)}
                style={{ minWidth: 260 }}
              >
                <option value="">{t('toolbar_select_destination_list')}</option>
                {destinationOptions.map((tl) => (
                  <option key={tl.id} value={tl.id}>
                    {`${getListTypeIconText(tl.listType)} ${Number.isFinite(+tl.listType) ? t(getPageTitleContent(tl.listType)) : t('manage_tasklists_title')} - ${tl.title || tl.id}`}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleMove}
                disabled={!canMove}
                color={COLORS.BUTTON_GRAY}
                text={loadingMove ? t('toolbar_moving') : `${t('toolbar_move_selected_to_another_list')} (${selectedIds.size})`}
              />
            </div>
          }
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{t('toolbar_completion_tools')}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <DropdownButton
              id="selected-task-actions"
              variant="outline-secondary"
              title={t('toolbar_selected_actions')}
              disabled={!hasSelection || loadingMove}
            >
              <Dropdown.Item onClick={() => handleSelectedTaskActions('selected_done')}>
                {`${t('toolbar_mark_selected_done')} (${selectedIds.size})`}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectedTaskActions('selected_undone')}>
                {`${t('toolbar_mark_selected_undone')} (${selectedIds.size})`}
              </Dropdown.Item>
            </DropdownButton>
            <Button onClick={() => {
              if (window.confirm(t('mark_all_tasks_done_confirm_message'))) {
                markAllTasksDone(params.id)
              }
            }} text={t('mark_all_tasks_done')} iconName={ICONS.SQUARE_CHECK} color={COLORS.BUTTON_GRAY} />
            <Button onClick={() => {
              if (window.confirm(t('mark_all_tasks_undone_confirm_message'))) {
                markAllTasksUndone(params.id)
              }
            }} text={t('mark_all_tasks_undone')} iconName={ICONS.HOURGLASS_1} color={COLORS.BUTTON_GRAY} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{t('toolbar_delete_tools')}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button
              onClick={() => handleSelectedTaskActions('selected_delete')}
              disabled={!canDeleteSelected}
              color={COLORS.DELETEBUTTON}
              iconName={ICONS.DELETE}
              text={`${t('toolbar_delete_selected')} (${selectedIds.size})`}
            />
          </div>
        </div>

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
        </Col>
      </Row>

      <hr />

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
                defaultSort={SortMode.Text_ASC}
              />
            ) : (<></>)
          }

          {toolsMenu}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            <Button
              iconName={ICONS.PLUS}
              color={showAddTask ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
              text={showAddTask ? tCommon('buttons.button_close') : t('button_add_task')}
              onClick={toggleAddTask}
            />
            <Button
              iconName={ICONS.PLUS}
              color={showBulkAddTasks ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
              text={showBulkAddTasks ? tCommon('buttons.button_close') : t('button_add_tasks_bulk')}
              onClick={toggleBulkAddTasks}
            />
          </div>

          {showBulkAddTasks &&
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <Form.Group controlId="bulkTasksInput">
                <Form.Label>{t('button_add_tasks_bulk')}</Form.Label>
                <Form.Control
                  autoComplete="off"
                  as="textarea"
                  rows={6}
                  placeholder={t('bulk_tasks_placeholder')}
                  value={bulkTasksText}
                  onChange={(e) => setBulkTasksText(e.target.value)}
                />
              </Form.Group>
              <Button
                iconName={ICONS.PLUS}
                onClick={addBulkTasks}
                text={t('button_save_multiple_tasks')}
                disabled={bulkTasksText.trim().length === 0}
              />
            </div>
          }

          {tasks != null && tasks.length > 0 ? (
            <Tasks
              taskListID={params.id}
              items={tasks}
              onDelete={deleteTask}
              onToggle={toggleReminder}
              selectedIds={selectedIds}
              onSelectToggle={toggleSelect}
              counter={taskCounter}
              counterText={t('task_counter_text')}
              originalList={originalTasks}
            />
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



