import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS, COLORS, NAVIGATION, DB } from '../../utils/Constants';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import ListRow from '../Site/ListRow';

import AddDrinkingProduct from './AddDrinkingProduct';

export default function DrinkingProduct({ drinkingProduct, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });


    const editDrinkingProduct = (editedDrinkingProduct) => {
        editedDrinkingProduct["id"] = drinkingProduct.id;
        onEdit(editedDrinkingProduct);
    }

    const drinkingProductTitle = `${drinkingProduct.name}${drinkingProduct.abv > 0 ? ` (${drinkingProduct.abv}%)` : ''}`;

    return (
        <ListRow
            item={drinkingProduct}
            dbKey={DB.DRINKING_PRODUCTS}
            headerProps={{
                title: drinkingProductTitle,
                titleTo: `${NAVIGATION.DRINKINGPRODUCT}/${drinkingProduct.id}`,
                titleIcon: ICONS.COCKTAIL,
                titleIconColor: COLORS.GRAY,
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={drinkingProduct.id}
            section={
                <>
                    <p>{t('drinkingproduct_manufacturer')}: {drinkingProduct.manufacturer}</p>
                    <p>{t('drinkingproduct_description')}: {drinkingProduct.description}</p>
                    <p>{t('drinkingproduct_category')}: {
                        t('drinkingproduct_category_' + getDrinkingProductCategoryNameByID(drinkingProduct.category))
                    }</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_drinking_product'),
                modalBody: (
                    <AddDrinkingProduct
                        onClose={() => setEditable(false)}
                        onSave={editDrinkingProduct}
                        drinkingProductID={drinkingProduct.id}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: !!drinkingProduct.haveAtHome,
                checkedText: t('drinkingproduct_have_at_home'),
                uncheckedText: t('drinkingproduct_not_have_at_home'),
                onCheck: () => { drinkingProduct["haveAtHome"] = true; onEdit(drinkingProduct); },
                onUncheck: () => { drinkingProduct["haveAtHome"] = false; onEdit(drinkingProduct); },
            }}
        />
    )
}



