import { Link } from 'react-router-dom';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import AddTask from './AddTask';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { useToggle } from '../UseToggle';

export default function Task({ taskListID, archived, task, onDelete, onToggle }) {

    //toggle
    const { status: editable, toggleStatus: toggleSetEditable } = useToggle();

    const updateTask = (updateTaskListID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseByIdAndSubId(Constants.DB_TASKS, updateTaskListID, task.id, object);
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
                                    <Link to={`/task/${task.id}/${taskListID}`}>{task.text}</Link>
                                </span>
                        }
                        {archived ? null :
                            <RightWrapper>
                                <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                                    style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                    onClick={() => toggleSetEditable()} />
                                <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                                    style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.4em' }}
                                    onClick={() => onDelete(taskListID, task.id)} />
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