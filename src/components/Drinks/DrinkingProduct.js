import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, ICONS, COLORS, NAVIGATION, DB } from '../../utils/Constants';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import AddDrinkingProduct from './AddDrinkingProduct';

export default function DrinkingProduct({ item, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

    const updateDrinkingProduct = (updateDrinkingProductID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.DRINKINGPRODUCTS, updateDrinkingProductID, object);
        setEditable(false);
    }

    const drinkingProductTitle = `${item.name}${item.abv > 0 ? ` (${item.abv}%)` : ''}`;

    return (
        <ListRow
            item={item}
            dbKey={DB.DRINKING_PRODUCTS}
            headerProps={{
                title: drinkingProductTitle,
                titleTo: `${NAVIGATION.DRINKINGPRODUCT}/${item.id}`,
                titleIcon: ICONS.COCKTAIL,
                titleIconColor: COLORS.GRAY,
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <>
                    <p>{t('drinkingproduct_manufacturer')}: {item.manufacturer}</p>
                    <p>{t('drinkingproduct_description')}: {item.description}</p>
                    <p>{t('drinkingproduct_category')}: {
                        t('drinkingproduct_category_' + getDrinkingProductCategoryNameByID(item.category))
                    }</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_drinking_product'),
                modalBody: (
                    <AddDrinkingProduct
                        onClose={() => setEditable(false)}
                        onSave={updateDrinkingProduct}
                        drinkingProductID={item.id}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: !!item.haveAtHome,
                //checkedText: t('drinkingproduct_have_at_home'),
                //uncheckedText: t('drinkingproduct_not_have_at_home'),
                onCheck: () => { item["haveAtHome"] = true; onEdit(item); },
                onUncheck: () => { item["haveAtHome"] = false; onEdit(item); },
            }}
        />
    )
}



