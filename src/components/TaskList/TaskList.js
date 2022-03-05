import { FaTimes, FaListAlt} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const TaskList = ({taskList, onDelete}) => {
    const { t } = useTranslation();
    return (
        <div className="task">
            <h4>
                <span>
                <FaListAlt style={{color:'gray', cursor: 'pointer', marginRight:'5px', marginBottom: '3x' }} />
                {taskList.title} 
                </span>
                <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => {if(window.confirm(t('delete_list_confirm_message'))) {onDelete(taskList.id);}}} />
            </h4>
            <p>{taskList.description}</p>
            <p><Link to={`/tasklist/${taskList.id}`}>{t('view_details')}</Link></p>
        </div>
    )
}

export default TaskList
