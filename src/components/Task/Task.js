import { DB } from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import AddTask from './AddTask';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { useToggle } from '../useToggle';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import NavButton from '../Buttons/NavButton';

export default function Task({ taskListID, archived, task, onDelete, onToggle }) {

    //toggle
    const { status: editable, toggleStatus: toggleSetEditable } = useToggle();

    const updateTask = (updateTaskListID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseByIdAndSubId(DB.TASKS, updateTaskListID, task.id, object);
        toggleSetEditable();
    }

    return (
        <div
            onDoubleClick={() => archived ? null : onToggle(taskListID, task.id)}
            className={`listContainer ${archived ? '' : 'clickable'} ${task.reminder ? 'reminder' : ''}`}>
            {
                !editable &&
                <>
                    <h5>
                        { /* TODO: Rakenna view details arkiston taskin katselulle? */
                            archived ? <span>{task.text}</span> : !editable &&
                                <span>
                                    <NavButton to={`/task/${task.id}/${taskListID}`} className="">
                                        {task.text}
                                    </NavButton>
                                </span>
                        }
                        {archived ? null :
                            <RightWrapper>
                                <EditButton
                                    editable={editable}
                                    setEditable={toggleSetEditable}
                                />
                                <DeleteButton
                                    onDelete={onDelete}
                                    id={taskListID}
                                    subId={task.id}
                                />
                            </RightWrapper>
                        }
                    </h5>
                    <p>{task.day}</p>
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