//react
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';

export default function TaskListButton({ onShowAddTaskList, showAdd }) {

    //location
    const location = useLocation();

    //translation
    const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

    return (
        <>
            {location.pathname === '/managetasklists' && (
                <Button
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? t('button_close') : t('button_add_list')}
                    onClick={onShowAddTaskList} />
            )
            }
        </>
    )
}
