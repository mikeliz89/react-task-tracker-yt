import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';

import { TRANSLATION, ICONS, COLORS, NAVIGATION } from '../../utils/Constants';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import ListRow from '../Site/ListRow';

import AddDrinkingProduct from './AddDrinkingProduct';

export default function DrinkingProduct({ drinkingProduct, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

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

    const drinkingProductTitle = `${drinkingProduct.name}${drinkingProduct.abv > 0 ? ` (${drinkingProduct.abv}%)` : ''}`;

    const openEditModal = () => setShowEditModal(true);
    const closeEditModal = () => setShowEditModal(false);

    return (
        <>
            <ListRow
                headerTitle={drinkingProductTitle}
                headerTitleTo={`${NAVIGATION.DRINKINGPRODUCT}/${drinkingProduct.id}`}
                headerTitleIcon={ICONS.COCKTAIL}
                headerTitleIconColor={COLORS.GRAY}
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
                <CheckButton
                    checked={drinkingProduct.haveAtHome}
                    checkedText={t('drinkingproduct_have_at_home')}
                    uncheckedText={t('drinkingproduct_not_have_at_home')}
                    onCheck={markHaveAtHome}
                    onUncheck={markNotHaveAtHome}
                    style={{ margin: '5px' }}
                />
            </ListRow>
            <Modal show={editable} onHide={() => setEditable(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_drinking_product')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddDrinkingProduct
                        onClose={() => setEditable(false)}
                        onAddDrinkingProduct={editDrinkingProduct}
                        drinkingProductID={drinkingProduct.id}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}



