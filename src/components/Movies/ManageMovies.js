import ManageGeneric from '../Common/ManageGeneric';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddMovie from './AddMovie';
import ListMapper from '../Common/ListMapper';

export default function ManageMovies() {

    return (
        <ManageGeneric
            dbKey={DB.MOVIES}
            translationKey={TRANSLATION.MOVIES}
            AddComponent={AddMovie}
            ListComponent={ListMapper}
            iconName={ICONS.MOVIE}
            listNav={{ to: NAVIGATION.MANAGE_MOVIELISTS }}
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



