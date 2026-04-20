import { Form } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { DB, TRANSLATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useToggle } from '../Hooks/useToggle';
import ListRow from '../Site/ListRow';

import AddTask from './AddTask';

export default function Task({
    taskListID,
    archived,
    task,
    onDelete,
    onToggle,
    isSelected,
    onSelectToggle }) {

    //toggle
    const { status: editable, toggleStatus: toggleSetEditable, setStatus: setEditable } = useToggle();
    const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });

    const updateTask = (updateTaskListID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseByIdAndSubId(DB.TASKS, updateTaskListID, task.id, object);
        toggleSetEditable();
    }

    const handleCheckboxChange = (e) => {
        e.stopPropagation();          // estä dblclick-propagaatio
        onSelectToggle?.(task.id);
    };

    return (
        <ListRow
            onDoubleClick={() => archived ? null : onToggle(taskListID, task.id)}
            className={`taskRowContainer ${archived ? '' : 'clickable'} ${task.reminder ? 'reminder taskDone' : ''}`}
            headerClassName={!editable ? 'taskRowTop' : ''}
            headerLeftClassName={!editable ? 'taskRowLeft' : ''}
            actionsClassName={!editable ? 'taskRowActions' : ''}
            stopRightClickPropagation={!editable}
            showEditButton={!editable && !archived}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={!editable && !archived}
            onDelete={onDelete}
            deleteId={taskListID}
            deleteSubId={task.id}
            headerPrefix={!editable && !archived ? (
                <Form.Check
                    id={`select-task-${task.id}`}
                    className="mb-0 taskRowCheckbox"
                    type="checkbox"
                    checked={!!isSelected}
                    onChange={handleCheckboxChange}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : null}
            headerTitle={!editable ? task.text : null}
            headerTitleTo={!editable && !archived ? `/task/${task.id}/${taskListID}` : null}
            headerTitleWrapperClassName={!editable ? 'taskRowTitle' : ''}
            headerTitleClassName={!editable && !archived ? 'taskRowLink' : ''}
            headerSuffix={!editable && task.reminder ? <span className="taskDoneBadge">{t('ready')}</span> : null}
        >
            {
                !editable &&
                <>
                    {!!task.day && <p className="taskRowDay">{task.day}</p>}
                </>
            }
            {
                editable && <AddTask
                    taskID={task.id}
                    taskListID={taskListID}
                    onClose={() => toggleSetEditable()}
                    onSave={updateTask}
                    showLabels={true} />
            }

        </ListRow>
    )
}


