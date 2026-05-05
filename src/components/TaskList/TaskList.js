import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateToFirebaseById } from '../../datatier/datatier';
import { DB, ICONS, COLORS, NAVIGATION, TRANSLATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Icon from '../Icon';
import ListRow from '../Site/ListRow';
import AddTaskList from './AddTaskList';


export default function TaskList({ taskList, archived, onDelete }) {

    const [editable, setEditable] = useState(false);

    const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });

    const updateTaskList = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.TASKLISTS, taskList.id, object);
        setEditable(false);
    };

    return (
        <ListRow
            item={taskList}
            dbKey={DB.TASKLISTS}
            headerProps={{
                prefix: <Icon name={ICONS.LIST_ALT} color={COLORS.GRAY} />,
                title: (
                    <Link
                        style={{ textDecoration: 'none' }}
                        to={archived ?
                            `${NAVIGATION.TASKLIST_ARCHIVE}/${taskList.id}`
                            : `${NAVIGATION.TASKLIST}/${taskList.id}`}
                    >
                        {taskList.title}
                    </Link>
                )
            }}
            showStarRating={false}
            showEditButton={!archived}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={taskList.id}
            section={<p>{taskList.description}</p>}
            modalProps={{
                modalTitle: t('modal_header_edit_task_list'),
                modalBody: (
                    <AddTaskList
                        taskListID={taskList.id}
                        onClose={() => setEditable(false)}
                        onSave={updateTaskList}
                        showLabels={true}
                    />
                )
            }}

        />
    );
}




