
import ManageGeneric from '../Common/ManageGeneric';
import { TRANSLATION, ICONS, DB } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddPerson from './AddPerson';
import Person from './Person';
import ListMapper from '../Common/ListMapper';
import { useTranslation } from 'react-i18next';

export default function ManagePeople() {
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });

  return (
    <ManageGeneric
      dbKey={DB.PEOPLE}
      translationKey={TRANSLATION.PEOPLE}
      AddComponent={AddPerson}
      ListComponent={ListMapper}
      ListComponentProps={{
        ItemComponent: Person,
      }}
      iconName={ICONS.USER_ALT}
      title={t('title')}
      searchSortFilterOptions={{
        showSearchByText: true,
        showSearchByDescription: true,
        defaultSort: SortMode.Name_ASC,
        showSortByName: true,
        showSortByBirthday: true,
        filterMode: FilterMode.Name,
      }}
      copyButton={{ showCopyButton: true }}
    />
  );
}



