import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, COLORS, DB, ICONS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import ManagePage from '../Site/ManagePage';

import AddFoodItem from './AddFoodItem';
import FoodItems from './FoodItems';

export default function ManageFoodItems() {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: foodItems, setData: setFoodItems,
        originalData: originalFoodItems, counter, loading } = useFetch(DB.FOODITEMS);

    //modal
    const { status: showAddFoodItem, toggleStatus: toggleAddFoodItem } = useToggle();

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

    const addFoodItem = (foodItem) => {
        try {
            foodItem["created"] = getCurrentDateAsJson();
            foodItem["createdBy"] = currentUser.email;
            pushToFirebase(DB.FOODITEMS, foodItem);
            showSuccess(t('fooditem_save_successful'));
        } catch (ex) {
            showFailure(t('fooditem_save_exception'));
            console.warn(ex);
        }
    }

    const deleteFoodItem = (id) => {
        removeFromFirebaseById(DB.FOODITEMS, id);
    }

    const editFoodItem = (foodItem) => {
        const id = foodItem.id;
        updateToFirebaseById(DB.FOODITEMS, id, foodItem);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('manage_fooditems_title')}
            iconName={ICONS.CARROT}
            alert={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddFoodItem,
                onHide: toggleAddFoodItem,
                title: t('modal_header_add_food_item'),
                body: (
                    <AddFoodItem onClose={toggleAddFoodItem}
                        onSave={addFoodItem} />
                ),
            }}
            searchSortFilter={{
                onSet: setFoodItems,
                originalList: originalFoodItems,
                //search
                showSearchByText: true,
                //sort
                showSortByName: true,
                showSortByCreatedDate: true,
                //filter
                filterMode: FilterMode.Name,
                showFilterHaveAtHome: true,
            }}
            addButton={{
                show: showAddFoodItem,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_fooditem'),
                onToggle: toggleAddFoodItem,
            }}
            hasItems={foodItems != null && foodItems.length > 0}
            emptyText={t('no_fooditems_to_show')}
        >
            <>
                <FoodItems items={foodItems}
                    originalList={originalFoodItems}
                    counter={counter}
                    onDelete={deleteFoodItem}
                    onEdit={editFoodItem} />
            </>
        </ManagePage>
    )
}


