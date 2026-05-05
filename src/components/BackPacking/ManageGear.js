import ManageGeneric from '../Common/ManageGeneric';
import { TRANSLATION, DB, ICONS } from "../../utils/Constants";
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddGear from './AddGear';
import Gears from './Gears';

export default function ManageGear() {

    return (
        <ManageGeneric
            dbKey={DB.BACKPACKING_GEAR}
            translationKey={TRANSLATION.BACKPACKING}
            AddComponent={AddGear}
            ListComponent={Gears}
            iconName={ICONS.WRENCH}
            AddComponentProps={{}}
            ListComponentProps={{}}
            searchSortFilterOptions={{
                showSearchByText: true,
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                showFilterHaveAtHome: true,
                filterMode: FilterMode.Name,
                showFilterHaveRated: true,
            }}
        />
    );

}

