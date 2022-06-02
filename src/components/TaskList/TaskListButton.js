import React from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../Button'
import { useTranslation } from 'react-i18next';

export default function TaskListButton({ onShowAddTaskList, showAdd }) {

    const location = useLocation();
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
