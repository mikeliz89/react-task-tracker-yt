import { useState } from 'react';
import { Link } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { DB, ICONS, COLORS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import Icon from '../Icon';
import RightWrapper from '../Site/RightWrapper';

import AddTaskList from './AddTaskList';

export default function TaskList({ taskList, archived, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    const updateTaskList = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.TASKLISTS, taskList.id, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            {!editable &&
                <>
                    <h5>
                        <span>
                            <Icon name={ICONS.LIST_ALT} color={COLORS.GRAY} />
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




