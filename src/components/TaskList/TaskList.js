//react
import { FaTimes, FaListAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const TaskList = ({ taskList, archived, onDelete }) => {

    //translation
    const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

    return (
        <div className='task'>
            <h5>
                <span>
                    <FaListAlt style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {taskList.title}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_list_confirm_message'))) { onDelete(taskList.id); } }} />
            </h5>
            <p>{taskList.description}</p>
            <p>
                <Link className="btn btn-primary"
                    to={archived ? `/tasklistarchive/${taskList.id}` : `/tasklist/${taskList.id}`}>{t('view_details')}</Link>
            </p>
        </div>
    )
}

export default TaskList
