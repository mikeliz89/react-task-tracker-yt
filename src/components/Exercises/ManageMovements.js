import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import GoBackButton from '../GoBackButton';
import PageTitle from '../PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { db } from '../../firebase-config';
import { onValue, ref, remove } from 'firebase/database';
import Movements from './Movements';
import CenterWrapper from '../CenterWrapper';
import PageContentWrapper from '../PageContentWrapper';
import Counter from '../Counter';
import * as Constants from '../../utils/Constants';

function ManageMovements() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

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
        const dbref = await ref(db, Constants.DB_EXERCISE_MOVEMENTS);
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
        const dbref = ref(db, `${Constants.DB_EXERCISE_MOVEMENTS}/${id}`);
        remove(dbref)
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link className="btn btn-primary" to={`/addmovement`}>{t('add_movement')}</Link>
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_movements_title')} />
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
    )
}

export default ManageMovements