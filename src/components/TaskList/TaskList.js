import { useState } from 'react';
import { Link } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { DB, ICONS, COLORS, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Icon from '../Icon';
import ListRow from '../Site/ListRow';
import AddTaskList from './AddTaskList';

export default function TaskList({ taskList, archived, onDelete }) {

    const [editable, setEditable] = useState(false);

    const updateTaskList = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.TASKLISTS, taskList.id, object);
        setEditable(false);
    };

    return (
        <>
            {!editable && (
                <ListRow
                    headerPrefix={<Icon name={ICONS.LIST_ALT} color={COLORS.GRAY} />}
                    headerTitle={
                        <Link
                            style={{ textDecoration: 'none' }}
                            to={archived ?
                                `${NAVIGATION.TASKLIST_ARCHIVE}/${taskList.id}`
                                : `${NAVIGATION.TASKLIST}/${taskList.id}`}
                        >
                            {taskList.title}
                        </Link>
                    }
                    showEditButton={!archived}
                    editable={editable}
                    setEditable={setEditable}
                    showDeleteButton={true}
                    onDelete={onDelete}
                    deleteId={taskList.id}
                >
                    <p>{taskList.description}</p>
                </ListRow>
            )}
            {editable && (
                <AddTaskList
                    taskListID={taskList.id}
                    onClose={() => setEditable(false)}
                    onSave={updateTaskList}
                    showLabels={true}
                />
            )}
        </>
    );
}




