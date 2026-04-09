import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { RecipeTypes } from '../../utils/Enums';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import Recipes from '../Recipe/Recipes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManagePage from '../Site/ManagePage';

import AddDrink from './AddDrink';

export default function ManageDrinks() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //navigate
    const navigate = useNavigate();

    //fetch data
    const { data: drinks, setData: setDrinks,
        originalData: originalDrinks,
        counter, loading } = useFetch(DB.DRINKS);

    //modal
    const { status: showAddDrink, toggleStatus: toggleAddDrink } = useToggle();

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //user
    const { currentUser } = useAuth();

    const addDrink = async (drink) => {
        try {
            drink["created"] = getCurrentDateAsJson();
            drink["createdBy"] = currentUser.email;
            if (drink["isCore"] === undefined) {
                drink["isCore"] = false;
            }
            const key = await pushToFirebase(DB.DRINKS, drink);
            navigate(`${NAVIGATION.DRINK}/${key}`);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const deleteDrink = async (id) => {
        removeFromFirebaseById(DB.DRINKS, id);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('manage_drinks_title')}
            iconName={ICONS.COCKTAIL}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_DRINKINPRODUCTS}
                        icon={ICONS.WINE}
                    >
                        {t('button_manage_drinkingproducts')}
                    </NavButton>
                    <NavButton to={NAVIGATION.MANAGE_DRINKLISTS}
                        icon={ICONS.LIST_ALT} >
                        {t('button_drinklists')}
                    </NavButton>
                </>
            )}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddDrink,
                onHide: toggleAddDrink,
                title: t('modal_header_add_drink'),
                body: <AddDrink onSave={addDrink} onClose={toggleAddDrink} autoFocusTitle={true} />,
            }}
            searchSortFilter={{
                onSet: setDrinks,
                originalList: originalDrinks,
                //search
                showSearchByText: true,
                showSearchByDescription: true,
                showSearchByIncredients: true,
                //sort
                defaultSort: SortMode.Title_ASC,
                showSortByTitle: true,
                showSortByCreatedDate: true,
                showSortByStarRating: true,
                //filter
                showFilterCore: true,
                filterMode: FilterMode.Title,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddDrink,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_drinks'),
                onToggle: toggleAddDrink,
            }}
            hasItems={drinks != null && drinks.length > 0}
            emptyText={t('no_drinks_to_show')}
        >
            <>
                <Recipes
                    translation={TRANSLATION.TRANSLATION}
                    translationKeyPrefix={TRANSLATION.DRINKS}
                    recipes={drinks}
                    recipeType={RecipeTypes.Drink}
                    originalList={originalDrinks}
                    counter={counter}
                    onDelete={deleteDrink} />
            </>
        </ManagePage>
    )
}



