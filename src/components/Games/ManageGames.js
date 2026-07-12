import ManageGeneric from '../Common/ManageGeneric';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddGame from './AddGame';
import Game from './Game';

export default function ManageGames() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    return (
        <ManageGeneric
            title={t('games_title')}
            dbKey={DB.GAMES}
            translationKey={TRANSLATION.GAMES}
            AddComponent={AddGame}
            ListComponentProps={{
                ItemComponent: Game,
                dbUrl: DB.GAMES,
                detailsNavigation: NAVIGATION.GAME,
                showConsole: true
            }}
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
            copyButton={{ showCopyButton: true }}
        />
    );
}