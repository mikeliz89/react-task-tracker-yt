import ManageGeneric from '../Common/ManageGeneric';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddGame from './AddGame';
import Games from './Games';

export default function ManageGames() {

    return (
        <ManageGeneric
            dbKey={DB.GAMES}
            translationKey={TRANSLATION.GAMES}
            AddComponent={AddGame}
            ListComponent={Games}
            iconName={ICONS.GAMEPAD}
            listNav={{ to: NAVIGATION.MANAGE_GAMELISTS }}
            searchSortFilterOptions={{
                showSearchByText: true,
                showSearchByDescription: true,
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                showSortByCreatedDate: true,
                showSortByPublishYear: true,
                filterMode: FilterMode.Name,
                showFilterHaveAtHome: true,
                showFilterHaveRated: true
            }}
        />
    );
}