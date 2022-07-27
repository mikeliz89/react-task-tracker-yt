//react
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
//buttons
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import AddGear from './AddGear';
//firebase
import { db } from '../../firebase-config';
import { ref, push } from 'firebase/database';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';

export default function ManageGear() {

    //constants
    const DB_GEAR = "/backpacking-gear";

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //states
    const [showAdd, setShowAdd] = useState(false);

    //user
    const { currentUser } = useAuth();

    /** Add Gear To Firebase */
    const addGear = async (gear) => {
        try {
            gear["created"] = getCurrentDateAsJson();
            gear["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_GEAR);
            push(dbref, gear);
            // setMessage(t('save_success'));
            // setShowMessage(true);
        } catch (ex) {
            // setError(t('save_exception'));
        }
    }

    return (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAdd ? 'red' : 'green'}
                        text={showAdd ? t('button_close') : t('button_add_gear')}
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <h3 className="page-title">{t('my_gear_title')}</h3>

            <div className="page-content">
                {showAdd && <AddGear onAddGear={addGear} onClose={() => setShowAdd(false)} />}
            </div>
        </div>
    )
}
