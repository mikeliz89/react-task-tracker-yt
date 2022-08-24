//react
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
//buttons
import GoBackButton from '../GoBackButton';
//pagetitle
import PageTitle from '../PageTitle';
//SearchSortFilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
//firebase
import { db } from '../../firebase-config';
import { onValue, ref, remove } from 'firebase/database';
//exercises
import Movements from './Movements';

function ManageMovements() {

    const DB_MOVEMENTS = '/exercise-movements';

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //states
    const [loading, setLoading] = useState(true);
    const [movements, setMovements] = useState();
    const [originalMovements, setOriginalMovements] = useState();

    //load data
    useEffect(() => {
        let cancel = false;

        const getMovements = async () => {
            if (cancel) {
                return;
            }
            await fetchMovementsFromFirebase();
        }
        getMovements();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchMovementsFromFirebase = async () => {
        const dbref = await ref(db, DB_MOVEMENTS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setMovements(fromDB);
            setOriginalMovements(fromDB);
            setLoading(false);
        })
    }

    const deleteMovement = async (id) => {
        const dbref = ref(db, `${DB_MOVEMENTS}/${id}`);
        remove(dbref)
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link className="btn btn-primary" to={`/createmovement`}>{t('create_movement')}</Link>
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_movements_title')} />
            <div className="page-content">
                <p className="text-center">{t('movements')}</p>
                <SearchSortFilter
                    onSet={setMovements}
                    originalList={originalMovements}
                    showSearch={true}
                    useNameFiltering={true}
                    showSortByCreatedDate={true}
                    showSortByName={true} />
                {
                    movements != null && movements.length > 0 ? (
                        <Movements movements={movements}
                            onDelete={deleteMovement} />
                    ) : (
                        t('no_movements_to_show')
                    )
                }
            </div>
        </>
    )
}

export default ManageMovements