import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Recipes from '../Recipe/Recipes';
import AddDrink from './AddDrink';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Alert from '../Alert';
import { RecipeTypes } from '../../utils/Enums';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';

export default function ManageDrinks() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

    //navigate
    const navigate = useNavigate();

    //fetch data
    const { data: drinks, setData: setDrinks,
        originalData: originalDrinks,
        counter, loading } = useFetch(Constants.DB_DRINKS);

    //modal
    const { status: showAddDrink, toggleStatus: toggleAddDrink } = useToggle();

    //alert
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    //user
    const { currentUser } = useAuth();

    const addDrink = async (drink) => {
        try {
            drink["created"] = getCurrentDateAsJson();
            drink["createdBy"] = currentUser.email;
            if (drink["isCore"] === undefined) {
                drink["isCore"] = false;
            }
            const key = await pushToFirebase(Constants.DB_DRINKS, drink);
            navigate(`${Constants.NAVIGATION_DRINK}/${key}`);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setShowError(true);
            setError(t('save_exception'));
        }
    }

    const deleteDrink = (id) => {
        removeFromFirebaseById(Constants.DB_DRINKS, id);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <PageTitle title={t('manage_drinks_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link to={Constants.NAVIGATION_MANAGE_DRINKINPRODUCTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_WINE} color='white' />
                        {t('button_manage_drinkingproducts')}
                    </Link>
                    <Link to={Constants.NAVIGATION_MANAGE_DRINKLISTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_LIST_ALT} color='white' />
                        {t('button_drinklists')}
                    </Link>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success'
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddDrink} onHide={toggleAddDrink}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_drink')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddDrink onSave={addDrink} onClose={toggleAddDrink} />
                </Modal.Body>
            </Modal>


            {
                originalDrinks != null && originalDrinks.length > 0 ? (

                    <SearchSortFilter
                        onSet={setDrinks}
                        originalList={originalDrinks}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        showSearchByIncredients={true}
                        //sort
                        defaultSort={SortMode.Title_ASC}
                        showSortByTitle={true}
                        showSortByCreatedDate={true}
                        showSortByStarRating={true}
                        //filter
                        showFilterCore={true}
                        filterMode={FilterMode.Title}
                        showFilterHaveRated={true}
                        showFilterNotHaveRated={true}
                    />

                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddDrink ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddDrink ? t('button_close') : t('button_add_drinks')}
                    onClick={toggleAddDrink} />
            </CenterWrapper>

            {
                drinks != null && drinks.length > 0 ? (
                    <>
                        <Counter list={drinks} originalList={originalDrinks} counter={counter} />
                        <Recipes
                            translation={Constants.TRANSLATION_DRINKS}
                            recipes={drinks}
                            recipeType={RecipeTypes.Drink}
                            onDelete={deleteDrink} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_drinks_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
