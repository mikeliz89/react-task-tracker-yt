
import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, VARIANTS, COLORS } from "../../utils/Constants";
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import { getIconNameByCategory } from './Categories';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import AddGear from './AddGear';

export default function Gear({ gear, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();
    const [editable, setEditable] = useState(false);

    const updateGear = (object) => {
        // TODO: implement update logic if needed
        setEditable(false);
    };

    return (
        <>
            <ListRow
                headerTitle={gear.name}
                headerTitleTo={`${NAVIGATION.GEAR}/${gear.id}`}
                headerTitleIcon={getIconNameByCategory(gear.category)}
                headerTitleIconColor={COLORS.GRAY}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={gear.id}
                alert={{
                    message,
                    showMessage,
                    error,
                    showError,
                    variant: VARIANTS.SUCCESS,
                    onClose: clearMessages,
                }}
                starCount={gear.stars}
            >
                {gear.category !== "" ? (
                    <p> {'#' + t('gear_category_' + getGearCategoryNameByID(gear.category))}</p>
                ) : ('')}
                <p>{t('gear_weight')}: {gear.weightInGrams} g</p>
            </ListRow>
            <Modal show={editable} onHide={() => setEditable(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_gear')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGear
                        gearID={gear.id}
                        onSave={updateGear}
                        onClose={() => setEditable(false)}
                        showLabels={true}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}



