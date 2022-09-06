//react
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//icon
import Icon from '../Icon';
//utils
import * as Constants from '../../utils/Constants';

const TaskList = ({ taskList, archived, onDelete }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

    return (
        <div className='tasklist'>
            <h5>
                <span>
                    <Icon name='list-alt' color='gray' />
                    {taskList.title}
                </span>
                <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
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
