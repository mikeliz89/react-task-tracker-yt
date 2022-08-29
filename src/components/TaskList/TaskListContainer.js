//TaskList
import ManageTaskLists from "./ManageTaskLists";
//proptypes
import PropTypes from 'prop-types';
//enums
import { ListTypes } from "../../utils/Enums";

function TaskListContainer({ listType }) {
    return (
        <>
            <ManageTaskLists listType={listType} />
        </>
    )
}

export default TaskListContainer


TaskListContainer.defaultProps = {
    listType: ListTypes.None
}

TaskListContainer.propTypes = {
    listType: PropTypes.any
}