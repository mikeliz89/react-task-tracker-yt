import ManageGeneric from '../Common/ManageGeneric';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddGame from './AddGame';
import Game from './Game';
import ListMapper from '../Common/ListMapper';

export default function ManageBoardGames() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    return (
        <ManageGeneric
            title={t('board_games_title')}
            dbKey={DB.BOARD_GAMES}
            translationKey={TRANSLATION.GAMES}
            AddComponent={AddGame}
            ListComponent={ListMapper}
            ListComponentProps={{
                ItemComponent: Game,
                dbUrl: DB.BOARD_GAMES,
                detailsNavigation: NAVIGATION.BOARD_GAME,
                showConsole: false
            }}
            iconName={ICONS.GAMEPAD}
            listNav={{ to: NAVIGATION.MANAGE_BOARD_GAMELISTS }}
            AddComponentProps={{
                showConsole: false,
                dbUrl: DB.BOARD_GAMES
            }}
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
            copyButton={{ showCopyButton: true }}
        />
    )
}



