
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { RecipeTypes } from '../../utils/Enums';
import NavButton from '../Buttons/NavButton';
import Recipes from '../Recipe/Recipes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManageGeneric from '../Common/ManageGeneric';
import AddDrink from './AddDrink';


export default function ManageDrinks() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const addDrink = async (drink) => {
        drink["created"] = getCurrentDateAsJson();
        drink["createdBy"] = currentUser.email;
        if (drink["isCore"] === undefined) {
            drink["isCore"] = false;
        }
        const key = await pushToFirebase(DB.DRINKS, drink);
        navigate(`${NAVIGATION.DRINK}/${key}`);
    };

    return (
        <ManageGeneric
            dbKey={DB.DRINKS}
            translationKey={TRANSLATION.DRINKS}
            AddComponent={AddDrink}
            ListComponent={Recipes}
            iconName={ICONS.COCKTAIL}
            title={t('manage_drinks_title')}
            ListComponentProps={{
                translation: TRANSLATION.TRANSLATION,
                translationKeyPrefix: TRANSLATION.DRINKS,
                recipeType: RecipeTypes.Drink
            }}
            AddComponentProps={{
                autoFocusTitle: true,
                onSave: addDrink
            }}
            searchSortFilterOptions={{
                showSearchByText: true,
                showSearchByDescription: true,
                showSearchByIncredients: true,
                defaultSort: SortMode.Title_ASC,
                showSortByTitle: true,
                showSortByCreatedDate: true,
                showSortByStarRating: true,
                filterMode: FilterMode.Title,
                showFilterCore: true,
                showFilterHaveRated: true,
            }}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_DRINKINPRODUCTS} icon={ICONS.WINE}>
                        {t('button_manage_drinkingproducts')}
                    </NavButton>
                    <NavButton to={NAVIGATION.MANAGE_DRINKLISTS} icon={ICONS.LIST_ALT}>
                        {t('button_drinklists')}
                    </NavButton>
                </>
            )}
        />
    );
}



