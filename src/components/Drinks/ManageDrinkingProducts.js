import { useTranslation } from 'react-i18next';
import AddDrinkingProduct from './AddDrinkingProduct';
import DrinkingProducts from './DrinkingProducts';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import Counter from '../Site/Counter';
import ManagePage from '../Site/ManagePage';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';

export default function ManageDrinkingProducts() {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: drinkingProducts, setData: setDrinkingProducts,
        originalData: originalDrinkingProducts,
        counter, loading } = useFetch(DB.DRINKINGPRODUCTS);

    //modal
    const { status: showAddDrinkingProduct, toggleStatus: toggleAddDrinkingProduct } = useToggle();

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

    const addDrinkingProduct = (drinkingProduct) => {
        try {
            drinkingProduct["created"] = getCurrentDateAsJson();
            drinkingProduct["createdBy"] = currentUser.email;
            pushToFirebase(DB.DRINKINGPRODUCTS, drinkingProduct);
            showSuccess(t('drinkingproduct_save_successful'));
        } catch (ex) {
            showFailure(t('drinkingproduct_save_exception'));
        }
    }

    const deleteDrinkingProduct = (id) => {
        removeFromFirebaseById(DB.DRINKINGPRODUCTS, id);
    }

    const editDrinkingProduct = (drinkingProduct) => {
        const id = drinkingProduct.id;
        updateToFirebaseById(DB.DRINKINGPRODUCTS, id, drinkingProduct);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('manage_drinkingproducts_title')}
            iconName={ICONS.WINE}
            alert={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddDrinkingProduct,
                onHide: toggleAddDrinkingProduct,
                title: t('modal_header_add_drinking_product'),
                body: (
                    <AddDrinkingProduct
                        onClose={toggleAddDrinkingProduct}
                        onAddDrinkingProduct={addDrinkingProduct}
                    />
                ),
            }}
            searchSortFilter={{
                onSet: setDrinkingProducts,
                originalList: originalDrinkingProducts,
                //search
                showSearchByDescription: true,
                //sort
                showSortByCreatedDate: true,
                showSortByName: true,
                showSortByStarRating: true,
                //filter
                filterMode: FilterMode.Name,
                showFilterHaveAtHome: true,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddDrinkingProduct,
                iconName: ICONS.PLUS,
                secondIconName: ICONS.WINE,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_drinkingproduct'),
                onToggle: toggleAddDrinkingProduct,
            }}
            hasItems={drinkingProducts != null && drinkingProducts.length > 0}
            emptyText={t('no_drinkingproducts_to_show')}
        >
            <>
                <Counter list={drinkingProducts} originalList={originalDrinkingProducts} counter={counter} />
                <DrinkingProducts drinkingProducts={drinkingProducts}
                    onDelete={deleteDrinkingProduct}
                    onEdit={editDrinkingProduct} />
            </>
        </ManagePage>
    )
}