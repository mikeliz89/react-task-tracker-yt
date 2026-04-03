import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageBoardGameLists() {
    return (
        <ManageTaskLists listType={ListTypes.BoardGames} />
    )
}
