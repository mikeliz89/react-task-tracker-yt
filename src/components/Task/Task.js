import { DB } from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import AddTask from './AddTask';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { useToggle } from '../Hooks/useToggle';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import NavButton from '../Buttons/NavButton';
import { Form } from 'react-bootstrap';

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
        <div
            onDoubleClick={() => archived ? null : onToggle(taskListID, task.id)}
            className={`listContainer taskRowContainer ${archived ? '' : 'clickable'} ${task.reminder ? 'reminder taskDone' : ''}`}>
            {
                !editable &&
                <>
                    <div className="taskRowTop">
                        <div className="taskRowLeft">
                            {/* Valintaruutu vasemmalle (ei arkistossa) */}
                            {!archived && (
                                <Form.Check
                                    id={`select-task-${task.id}`}
                                    className="mb-0 taskRowCheckbox"
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={handleCheckboxChange}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}

                            {/* Otsikko / Linkki */}
                            { /* TODO: Rakenna view details arkiston taskin katselulle? */
                                archived ? <span className="taskRowTitle">{task.text}</span> : !editable &&
                                    <span className="taskRowTitle">
                                        <NavButton to={`/task/${task.id}/${taskListID}`} className="taskRowLink">
                                            {task.text}
                                        </NavButton>
                                    </span>
                            }

                            {task.reminder && <span className="taskDoneBadge">Done</span>}
                        </div>

                        {/* Oikean reunan napit (ei arkistossa) */}
                        {archived ? null :
                            <div className="taskRowActions" onClick={(e) => e.stopPropagation()}>
                                <RightWrapper>
                                    <EditButton
                                        editable={editable}
                                        setEditable={setEditable}
                                    />
                                    <DeleteButton
                                        onDelete={onDelete}
                                        id={taskListID}
                                        subId={task.id}
                                    />
                                </RightWrapper>
                            </div>
                        }
                    </div>

                    {!!task.day && <p className="taskRowDay">{task.day}</p>}
                </>
            }
            {
                editable && <AddTask
                    taskID={task.id}
                    taskListID={taskListID}
                    onClose={() => toggleSetEditable()}
                    onSave={updateTask}
                    showLabels={false} />
            }

        </div>
    )
}