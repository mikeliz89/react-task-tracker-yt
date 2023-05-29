import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import AddTask from './AddTask';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';

const Task = ({ taskListID, archived, task, onDelete, onToggle }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

    //states
    const [editable, setEditable] = useState(false);

    const updateTask = (updateTaskListID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseByIdAndSubId(Constants.DB_TASKS, updateTaskListID, task.id, object);
        setEditable(false);
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
                                <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                    onClick={() => editable ? setEditable(false) : setEditable(true)} />
                                <Icon name={Constants.ICON_DELETE} className="deleteBtn"
                                    style={{ color: 'red', cursor: 'pointer', fontSize: '1.4em' }}
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
                    onClose={() => setEditable(false)}
                    onSave={updateTask}
                    showLabels={false} />
            }

        </div>
    )
}

export default Task
