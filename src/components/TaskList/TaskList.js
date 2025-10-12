import { Link } from 'react-router-dom';
import Icon from '../Icon';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import AddTaskList from './AddTaskList';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';

export default function TaskList({ taskList, archived, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    const updateTaskList = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_TASKLISTS, taskList.id, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            {!editable &&
                <>
                    <h5>
                        <span>
                            <Icon name={Constants.ICON_LIST_ALT} color={Constants.COLOR_GRAY} />
                            <Link
                                style={{ textDecoration: 'none' }}
                                to={archived ? `/tasklistarchive/${taskList.id}` : `/tasklist/${taskList.id}`}>
                                {taskList.title}
                            </Link>
                        </span>
                        <RightWrapper>
                            {
                                !archived &&
                                <EditButton
                                    editable={editable}
                                    setEditable={setEditable}
                                />
                            }
                            <DeleteButton
                                onDelete={onDelete}
                                id={taskList.id}
                            />
                        </RightWrapper>
                    </h5>
                    <p>{taskList.description}</p>
                </>
            }
            {
                editable && <AddTaskList taskListID={taskList.id} onClose={() => setEditable(false)} onSave={updateTaskList} showLabels={false} />
            }
        </div>
    )
}

