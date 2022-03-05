import { FaTimes} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const Task = ({taskListID, task, onDelete, onToggle}) => {
    const { t } = useTranslation();
    return (
        <div onDoubleClick={() => onToggle(taskListID, task.id)} className={`task ${task.reminder ? 'reminder' : ''}`}>
            <h4>
            - {task.text} <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
            onClick={() => onDelete(taskListID, task.id)} />
            </h4>
            <p>{task.day}</p>
            <p><Link to={`/task/${task.id}/${taskListID}`}>{t('view_details')}</Link></p>
        </div>
    )
}

export default Task
