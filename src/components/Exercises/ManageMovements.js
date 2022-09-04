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
//ScrollToTop
import ScrollToTop from '../ScrollToTop';
import CenterWrapper from '../CenterWrapper';
import PageContentWrapper from '../PageContentWrapper';
import Counter from '../Counter';

function ManageMovements() {

    const DB_MOVEMENTS = '/exercise-movements';

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //states
    const [loading, setLoading] = useState(true);
    const [movements, setMovements] = useState();
    const [counter, setCounter] = useState(0);
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
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
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
                    <Link className="btn btn-primary" to={`/addmovement`}>{t('add_movement')}</Link>
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_movements_title')} />
            <PageContentWrapper>
                <CenterWrapper>
                    {t('movements')}
                </CenterWrapper>
                <SearchSortFilter
                    onSet={setMovements}
                    originalList={originalMovements}
                    showSearch={true}
                    useNameFiltering={true}
                    showSortByCreatedDate={true}
                    showSortByName={true} />
                {
                    movements != null && movements.length > 0 ? (
                        <>
                            <Counter list={movements} originalList={originalMovements} counter={counter} />
                            <Movements movements={movements}
                                onDelete={deleteMovement} />
                        </>
                    ) : (
                        <>
                            <CenterWrapper>
                                {t('no_movements_to_show')}
                            </CenterWrapper>
                        </>
                    )
                }
            </PageContentWrapper>
            <ScrollToTop />
        </>
    )
}

export default ManageMovements