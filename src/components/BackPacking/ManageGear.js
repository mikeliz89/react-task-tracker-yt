
import ManageGeneric from '../Common/ManageGeneric';
import { TRANSLATION, DB, ICONS } from "../../utils/Constants";
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddGear from './AddGear';
import Gear from './Gear';

export default function ManageGear() {

    return (
        <ManageGeneric
            dbKey={DB.BACKPACKING_GEAR}
            translationKey={TRANSLATION.BACKPACKING}
            AddComponent={AddGear}
            ListComponentProps={{
                ItemComponent: Gear
            }}
            iconName={ICONS.WRENCH}
            AddComponentProps={{}}
            searchSortFilterOptions={{
                showSearchByText: true,
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                showFilterHaveAtHome: true,
                filterMode: FilterMode.Name,
                showFilterHaveRated: true,
            }}
            copyButton={{ showCopyButton: true }}
        />
    );

}

