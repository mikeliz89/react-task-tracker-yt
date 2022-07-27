//react
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
//buttons
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import AddGear from './AddGear';
//firebase
import { db } from '../../firebase-config';
import { ref, push, onValue, remove } from 'firebase/database';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
import Gears from './Gears';

export default function ManageGear() {

    //constants
    const DB_GEAR = "/backpacking-gear";

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //states
    const [showAdd, setShowAdd] = useState(false);
    const [gear, setGear] = useState();
    const [loading, setLoading] = useState(true);

    //load data
    useEffect(() => {
        let cancel = false;

        const getGear = async () => {
            if (cancel) {
                return;
            }
            await fetchGearsFromFirebase()
        }
        getGear();

        return () => {
            cancel = true;
        }
    }, [])

    /** Fetch Gears From Firebase */
    const fetchGearsFromFirebase = async () => {
        const dbref = await ref(db, DB_GEAR);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setLoading(false);
            setGear(fromDB);
        })
    }

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

    const deleteGear = (id) => {
        const dbref = ref(db, `${DB_GEAR}/${id}`);
        remove(dbref)
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
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
                {
                    gear != null && gear.length > 0 ? (
                        <Gears gears={gear}
                            onDelete={deleteGear} />
                    ) : (
                        t('no_gear_to_show')
                    )
                }
            </div>
        </div>
    )
}
