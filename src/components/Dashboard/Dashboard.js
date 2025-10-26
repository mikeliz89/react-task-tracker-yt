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
    }, []);

    const setSessionStorage = (value) => {
        sessionStorage.setItem(SESSIONSTORAGE.FROM_PAGE, value);
    };

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <Tabs defaultActiveKey={fromPage} id="dashboard-Tab"
                className="mb-3">
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_ACTIONS} title={t('title_actions')}>
                    <Row>
                        <DashboardItem link={NAVIGATION.CAR}>
                            <BigButton
                                imageName="car.jpg"
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('car')}
                                iconName={ICONS.CAR}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_DRINKS}>
                            <BigButton
                                imageName="cocktail.jpg"
                                textcolor={COLORS.BLACK}
                                color="#f9a9d5"
                                text={t('drinks')}
                                iconName={ICONS.GLASS_MARTINI}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_PEOPLE}>
                            <BigButton
                                imageName="people.jpg"
                                textcolor={COLORS.BLACK}
                                color={COLORS.WHITE}
                                text={t('personlist')}
                                iconName={ICONS.USER_ALT}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_EXERCISES}>
                            <BigButton
                                imageName="exercises.PNG"
                                textcolor={COLORS.BLACK}
                                color="#ef7c1a"
                                text={t('exercises')}
                                iconName={ICONS.RUNNING}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
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
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.BMICALCULATOR}>
                            <BigButton
                                imageName="calculator.PNG"
                                textcolor={COLORS.BLACK}
                                text={t('bmi_calculator')}
                                iconName={ICONS.WEIGHT}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_RECIPES}>
                            <BigButton
                                imageName="recipes.png"
                                textcolor={COLORS.BLACK}
                                color="#b37401"
                                text={t('recipes')}
                                iconName={ICONS.UTENSILS}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_BACKPACKING}>
                            <BigButton
                                imageName="backpacking.jpg"
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('backpacking')}
                                iconName={ICONS.CAMPGROUND}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_ACTIONS)}
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
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_LISTS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_SHOPPINGLISTS}>
                            <BigButton
                                imageName="shoppinglists.png"
                                textcolor={COLORS.BLACK}
                                color="#fcba03"
                                text={t('shoppinglists')}
                                iconName={ICONS.CHECK_SQUARE}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_LISTS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_TASKLISTS}>
                            <BigButton
                                imageName="tasklists.PNG"
                                textcolor={COLORS.BLACK}
                                color="#fcba03"
                                text={t('tasklists')}
                                iconName={ICONS.CHECK_SQUARE}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_LISTS)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_LISTS}>
                            <BigButton
                                textcolor={COLORS.BLACK}
                                color={COLORS.WHITE}
                                text={t('other_lists')}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_LISTS)}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_MOVIES} title={t('title_movies')}>
                    <Row>
                        <DashboardItem link={NAVIGATION.MANAGE_MOVIES}>
                            <BigButton
                                imageName="movies.jpg"
                                iconName={ICONS.MOVIE}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('movies')}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_MOVIES)}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={SESSIONSTORAGE.DASHBOARD_GAMES} title={t('title_games')}>
                    <Row>
                        <DashboardItem link={NAVIGATION.MANAGE_GAMES}>
                            <BigButton
                                imageName="games.jpg"
                                iconName={ICONS.GAMEPAD}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('games')}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_GAMES)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_DISC_GOLF}>
                            <BigButton
                                imageName="discgolf.jpg"
                                iconName={ICONS.GAMEPAD}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('discgolf')}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_GAMES)}
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
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_MUSIC)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_MUSIC_RECORDS}>
                            <BigButton
                                imageName="music.jpg"
                                iconName={ICONS.MUSIC}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('music_records')}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_MUSIC)}
                            />
                        </DashboardItem>
                        <DashboardItem link={NAVIGATION.MANAGE_MUSIC_EVENTS}>
                            <BigButton
                                imageName="events.jpg"
                                iconName={ICONS.MUSIC}
                                textcolor={COLORS.BLACK}
                                color="#0cb058"
                                text={t('music_events')}
                                onClick={() => setSessionStorage(SESSIONSTORAGE.DASHBOARD_MUSIC)}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
            </Tabs>
        </PageContentWrapper>
    );
}