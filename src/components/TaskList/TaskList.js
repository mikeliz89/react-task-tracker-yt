import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import AddTaskList from './AddTaskList';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';

const TaskList = ({ taskList, archived, onDelete }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

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
                            <Icon name={Constants.ICON_LIST_ALT} color='gray' />
                            {taskList.title}
                        </span>
                        <RightWrapper>
                            <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name={Constants.ICON_DELETE} className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_list_confirm_message'))) { onDelete(taskList.id); } }} />
                        </RightWrapper>
                    </h5>
                    <p>{taskList.description}</p>
                    <p>
                        <Link className="btn btn-primary"
                            to={archived ? `/tasklistarchive/${taskList.id}` : `/tasklist/${taskList.id}`}>
                            {t('view_details')}
                        </Link>
                    </p>
                </>
            }
            {
                editable && <AddTaskList taskListID={taskList.id} onClose={() => setEditable(false)} onSave={updateTaskList} showLabels={false} />
            }
        </div>
    )
}

export default TaskList
