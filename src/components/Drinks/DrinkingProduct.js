import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS, COLORS, NAVIGATION } from '../../utils/Constants';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import NavButton from '../Buttons/NavButton';
import ListRow from '../Site/ListRow';

import AddDrinkingProduct from './AddDrinkingProduct';

export default function DrinkingProduct({ drinkingProduct, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

    const markHaveAtHome = () => {
        drinkingProduct["haveAtHome"] = true;
        onEdit(drinkingProduct);
    }

    const markNotHaveAtHome = () => {
        drinkingProduct["haveAtHome"] = false;
        onEdit(drinkingProduct);
    }

    const editDrinkingProduct = (editedDrinkingProduct) => {
        editedDrinkingProduct["id"] = drinkingProduct.id;
        onEdit(editedDrinkingProduct);
    }

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton to={`${NAVIGATION.DRINKINGPRODUCT}/${drinkingProduct.id}`} className=""
                        icon={ICONS.COCKTAIL} iconColor={COLORS.GRAY}>
                        {drinkingProduct.name + (drinkingProduct.abv > 0 ? ' (' + drinkingProduct.abv + '%)' : '')}
                    </NavButton>
                </span>
            }
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={drinkingProduct.id}
            starCount={drinkingProduct.stars}
        >
            <p>{t('drinkingproduct_manufacturer')}: {drinkingProduct.manufacturer}</p>
            <p>{t('drinkingproduct_description')}: {drinkingProduct.description}</p>
            <p>{t('drinkingproduct_category')}: {
                t('drinkingproduct_category_' + getDrinkingProductCategoryNameByID(drinkingProduct.category))
            }</p>
            {editable &&
                <AddDrinkingProduct
                    onClose={() => setEditable(!editable)}
                    onAddDrinkingProduct={editDrinkingProduct}
                    drinkingProductID={drinkingProduct.id} />
            }
            <p>
                <CheckButton
                    checked={drinkingProduct.haveAtHome}
                    checkedText={t('drinkingproduct_have_at_home')}
                    uncheckedText={t('drinkingproduct_not_have_at_home')}
                    onCheck={markHaveAtHome}
                    onUncheck={markNotHaveAtHome}
                    style={{ margin: '5px' }}
                />
            </p>
        </ListRow>
    )
}



