import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import ListRow from '../Site/ListRow';
import AddGarnish from './AddGarnish';

export default function Garnish({ garnish, drinkID, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

    const [editable, setEditable] = useState(false);

    const updateGarnish = (drinkID, newGarnish) => {
        updateToFirebaseByIdAndSubId(DB.DRINK_GARNISHES, drinkID, garnish.id, newGarnish);
        setEditable(false);
    };

    return (
        <>
            <ListRow
                item={garnish}
                dbKey={DB.DRINK_GARNISHES}
                headerTitle={garnish.name}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={drinkID}
                deleteSubId={garnish.id}
                modalTitle={t('edit_garnish')}
                showStarRating={false}
                modalBody={
                    <AddGarnish
                        garnishID={garnish.id}
                        drinkID={drinkID}
                        onSave={updateGarnish}
                        onDelete={onDelete}
                        onClose={() => setEditable(false)}
                    />
                }
            />
        </>
    );
}