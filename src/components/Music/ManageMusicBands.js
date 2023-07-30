import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Bands from './Bands';
import { useState, useEffect } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddBand from './AddBand';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';

export default function ManageMusicBands() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [bands, setBands] = useState();
    const [originalBands, setOriginalBands] = useState();
    const [showAdd, setShowAdd] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getBands = async () => {
            if (cancel) {
                return;
            }
            await fetchBandsFromFirebase();
        }
        getBands();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchBandsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_MUSIC_BANDS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setLoading(false);
            setBands(fromDB);
            setOriginalBands(fromDB);
        })
    }

    const deleteBand = async (id) => {
        removeFromFirebaseById(Constants.DB_MUSIC_BANDS, id);
    }

    const addBand = async (bandID, band) => {
        try {
            clearMessages();
            band["created"] = getCurrentDateAsJson();
            band["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MUSIC_BANDS, band);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
        }
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const editBand = (band) => {
        const id = band.id;
        updateToFirebaseById(Constants.DB_MUSIC_BANDS, id, band);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_PLUS}
                        color={showAdd ? 'red' : 'green'}
                        text={showAdd ? t('button_close') : t('button_add_music_band')}
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('music_bands_title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success'
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <div>
                <Link to={Constants.NAVIGATION_MANAGE_MUSICLISTS} className='btn btn-primary'>
                    <Icon name={Constants.ICON_LIST_ALT} color='white' />
                    {t('button_music_lists')}
                </Link>
            </div>

            {
                showAdd && <AddBand onSave={addBand} onClose={() => setShowAdd(false)} />
            }

            {
                originalBands != null && originalBands.length > 0 ? (
                    <SearchSortFilter
                        onSet={setBands}
                        originalList={originalBands}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        showSortByCreatedDate={true}
                        //filter
                        filterMode={FilterMode.Name}
                        showFilterSeenLive={true}
                        showFilterNotHaveSeenLive={true}
                    />
                ) : (<></>)
            }

            {
                bands != null && bands.length > 0 ? (
                    <>
                        <Counter list={bands} originalList={originalBands} counter={counter} />
                        <Bands bands={bands} onDelete={deleteBand} onEdit={editBand} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_bands_to_show')}
                        </CenterWrapper>
                    </>
                )
            }

        </PageContentWrapper>
    )
}
