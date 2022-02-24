import React from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../Button'

export default function TaskListButton({onAddTaskList, showAdd}) {

    const location = useLocation()

    return (
        <>
            { location.pathname === '/managetasklists' && (
                <Button 
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? 'Close' : 'Add List'} 
                    onClick={onAddTaskList} />
                )
            }
        </>
    )
}
