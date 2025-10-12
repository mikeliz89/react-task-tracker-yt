import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Recipes from '../Recipe/Recipes';
import AddDrink from './AddDrink';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Alert from '../Alert';
import { RecipeTypes } from '../../utils/Enums';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';
import NavButton from '../Buttons/NavButton';

export default function ManageDrinks() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //navigate
    const navigate = useNavigate();

    //fetch data
    const { data: drinks, setData: setDrinks,
        originalData: originalDrinks,
        counter, loading } = useFetch(DB.DRINKS);

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
            const key = await pushToFirebase(DB.DRINKS, drink);
            navigate(`${NAVIGATION.DRINK}/${key}`);
            showSuccess();
        } catch (ex) {
            showFailure();
        }

        function showSuccess() {
            setMessage(t('save_success'));
            setShowMessage(true);
        }

        function showFailure() {
            setShowError(true);
            setError(t('save_exception'));
        }
    }

    const deleteDrink = async (id) => {
        removeFromFirebaseById(DB.DRINKS, id);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <PageTitle title={t('manage_drinks_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_DRINKINPRODUCTS}
                        icon={ICONS.WINE}
                    >
                        {t('button_manage_drinkingproducts')}
                    </NavButton>
                    <NavButton to={NAVIGATION.MANAGE_DRINKLISTS}
                        icon={ICONS.LIST_ALT} >
                        {t('button_drinklists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS}
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
                    iconName={ICONS.PLUS}
                    color={showAddDrink ? COLORS.ADDBUTTON.OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddDrink ? tCommon('buttons.button_close') : t('button_add_drinks')}
                    onClick={toggleAddDrink} />
            </CenterWrapper>

            {
                drinks != null && drinks.length > 0 ? (
                    <>
                        <Counter list={drinks} originalList={originalDrinks} counter={counter} />
                        <Recipes
                            translation={TRANSLATION.TRANSLATION}
                            translationKeyPrefix={TRANSLATION.DRINKS}
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
