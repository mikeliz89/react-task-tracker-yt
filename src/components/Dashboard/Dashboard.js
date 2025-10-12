import BigButton from '../Buttons/BigButton';
import { useTranslation } from 'react-i18next';
import { Row, Tabs } from 'react-bootstrap';
import PageContentWrapper from '../Site/PageContentWrapper';
import { TRANSLATION, ICONS, COLORS, NAVIGATION, SESSIONSTORAGE } from '../../utils/Constants';
import DashboardItem from './DashboardItem';
import { Tab } from 'bootstrap';
import { useState, useEffect } from 'react';

export default function Dashboard() {

    const [fromPage, setFromPage] = useState('');
    const [loading, setLoading] = useState(true);

    //translation
    const { t } = useTranslation(TRANSLATION.DASHBOARD, { keyPrefix: TRANSLATION.DASHBOARD_BUTTONS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    useEffect(() => {
        // Access fromPage from session storage
        var fromPageSession = sessionStorage.getItem(SESSIONSTORAGE.FROM_PAGE);
        if (fromPageSession == null) {
            //initialize as actions
            fromPageSession = SESSIONSTORAGE.DASHBOARD_ACTIONS;
        }
        // Update session storage
        setSessionStorage(fromPageSession);
        setFromPage(fromPageSession);

        setLoading(false);

        //console.log("FrompageSession", fromPageSession);

    }, []); //No dependency to trigger in each page load

    const setFromActions = () => {
        setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS);
    }

    const setFromMedia = () => {
        setSessionStorage(SESSIONSTORAGE.DASHBOARD_MEDIA);
    }

    const setFromMusic = () => {
        setSessionStorage(SESSIONSTORAGE.DASHBOARD_MUSIC);
    }

    const setFromLists = () => {
        setSessionStorage(SESSIONSTORAGE.DASHBOARD_LISTS);
    }

    const setSessionStorage = (value) => {
        sessionStorage.setItem(SESSIONSTORAGE.FROM_PAGE, value);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            {/* <div>FromPage:</div>
            {fromPage} */}

            <Tabs defaultActiveKey={fromPage} id="dashboard-Tab"
                className="mb-3">
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_ACTIONS} title={t('title_actions')}>
                    {/* Create New Row For Sets of 4 buttons  */}
                    <Row>
                        <DashboardItem link={NAVIGATION.CAR}>
                            <BigButton
                                imageName="car.jpg"
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('car')}
                                iconName={ICONS.CAR}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_DRINKS}>
                            <BigButton
                                imageName="cocktail.jpg"
                                textcolor={COLORS.BLACK}
                                color="#f9a9d5"
                                text={t('drinks')}
                                iconName={ICONS.GLASS_MARTINI}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_PEOPLE}>
                            <BigButton
                                imageName="people.jpg"
                                textcolor={COLORS.BLACK}
                                color={COLORS.WHITE}
                                text={t('personlist')}
                                iconName={ICONS.USER_ALT}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_EXERCISES}>
                            <BigButton
                                imageName="exercises.PNG"
                                textcolor={COLORS.BLACK}
                                color="#ef7c1a"
                                text={t('exercises')}
                                iconName={ICONS.RUNNING}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                    </Row>
                    <Row>
                        <DashboardItem link={NAVIGATION.LINKSLIST}>
                            <BigButton
                                imageName="links.jpg"
                                textcolor={COLORS.BLACK}
                                color={COLORS.WHITE}
                                text={t('links_list')}
                                iconName={ICONS.EXTERNAL_LINK_ALT}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.BMICALCULATOR}>
                            <BigButton
                                imageName="calculator.PNG"
                                textcolor={COLORS.BLACK}
                                text={t('bmi_calculator')}
                                iconName={ICONS.WEIGHT}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_RECIPES}>
                            <BigButton
                                imageName="recipes.png"
                                textcolor={COLORS.BLACK}
                                color="#b37401"
                                text={t('recipes')}
                                iconName={ICONS.UTENSILS}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_BACKPACKING}>
                            <BigButton
                                imageName="backpacking.jpg"
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('backpacking')}
                                iconName={ICONS.CAMPGROUND}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_LISTS} title={t('title_lists')}>
                    <Row>
                        <DashboardItem link={NAVIGATION.MANAGE_PROGRAMMING}>
                            <BigButton
                                imageName="programming.jpg"
                                iconName={ICONS.LAPTOP}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('programming')}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_SHOPPINGLISTS}>
                            <BigButton
                                imageName="shoppinglists.png"
                                textcolor={COLORS.BLACK}
                                color="#fcba03"
                                text={t('shoppinglists')}
                                iconName={ICONS.CHECK_SQUARE}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_TASKLISTS}>
                            <BigButton
                                imageName="tasklists.PNG"
                                textcolor={COLORS.BLACK}
                                color="#fcba03"
                                text={t('tasklists')}
                                iconName={ICONS.CHECK_SQUARE}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_LISTS}>
                            <BigButton
                                textcolor={COLORS.BLACK}
                                color={COLORS.WHITE}
                                text={t('other_lists')}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_MEDIA} title={t('title_media')}>
                    <Row>
                        <DashboardItem link={NAVIGATION.MANAGE_MOVIES}>
                            <BigButton
                                imageName="movies.jpg"
                                iconName={ICONS.MOVIE}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('movies')}
                                onClick={() => setFromMedia()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_GAMES}>
                            <BigButton
                                imageName="games.jpg"
                                iconName={ICONS.GAMEPAD}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('games')}
                                onClick={() => setFromMedia()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_DISC_GOLF}>
                            <BigButton
                                imageName="discgolf.jpg"
                                iconName={ICONS.GAMEPAD}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('discgolf')}
                                onClick={() => setFromMedia()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_MUSIC} title={t('title_music')}>
                    <Row>
                        <DashboardItem link={NAVIGATION.MANAGE_MUSIC_BANDS}>
                            <BigButton
                                imageName="bands.jpg"
                                iconName={ICONS.MUSIC}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('music_bands')}
                                onClick={() => setFromMusic()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_MUSIC_RECORDS}>
                            <BigButton
                                imageName="music.jpg"
                                iconName={ICONS.MUSIC}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('music_records')}
                                onClick={() => setFromMusic()}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_MUSIC_EVENTS}>
                            <BigButton
                                imageName="events.jpg"
                                iconName={ICONS.MUSIC}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('music_events')}
                                onClick={() => setFromMusic()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
            </Tabs>


        </PageContentWrapper>
    )
}
