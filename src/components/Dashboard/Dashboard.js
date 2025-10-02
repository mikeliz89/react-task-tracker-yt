import BigButton from '../Buttons/BigButton';
import { useTranslation } from 'react-i18next';
import { Row, Tabs } from 'react-bootstrap';
import PageContentWrapper from '../Site/PageContentWrapper';
import * as Constants from '../../utils/Constants';
import DashboardItem from './DashboardItem';
import { Tab } from 'bootstrap';
import { useState, useEffect } from 'react';

export default function Dashboard() {

    const [fromPage, setFromPage] = useState('');
    const [loading, setLoading] = useState(true);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DASHBOARD, { keyPrefix: Constants.TRANSLATION_DASHBOARD_BUTTONS });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    useEffect(() => {
        // Access fromPage from session storage
        var fromPageSession = sessionStorage.getItem(Constants.SESSION_FROM_PAGE);
        if (fromPageSession == null) {
            //initialize as actions
            fromPageSession = Constants.SESSION_DASHBOARD_ACTIONS;
        }
        // Update session storage
        setSessionStorage(fromPageSession);
        setFromPage(fromPageSession);

        setLoading(false);

        //console.log("FrompageSession", fromPageSession);

    }, []); //No dependency to trigger in each page load

    const setFromActions = () => {
        setSessionStorage(Constants.SESSION_DASHBOARD_ACTIONS);
    }

    const setFromMedia = () => {
        setSessionStorage(Constants.SESSION_DASHBOARD_MEDIA);
    }

    const setFromMusic = () => {
        setSessionStorage(Constants.SESSION_DASHBOARD_MUSIC);
    }

    const setFromLists = () => {
        setSessionStorage(Constants.SESSION_DASHBOARD_LISTS);
    }

    const setSessionStorage = (value) => {
        sessionStorage.setItem(Constants.SESSION_FROM_PAGE, value);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            {/* <div>FromPage:</div>
            {fromPage} */}

            <Tabs defaultActiveKey={fromPage} id="dashboard-Tab"
                className="mb-3">
                <Tab eventKey={Constants.SESSION_DASHBOARD_ACTIONS} title={t('title_actions')}>
                    {/* Create New Row For Sets of 4 buttons  */}
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_CAR}>
                            <BigButton
                                imageName="car.jpg"
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('car')}
                                iconName={Constants.ICON_CAR}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_DRINKS}>
                            <BigButton
                                imageName="cocktail.jpg"
                                textcolor={Constants.COLOR_BLACK}
                                color="#f9a9d5"
                                text={t('drinks')}
                                iconName={Constants.ICON_GLASS_MARTINI}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_PEOPLE}>
                            <BigButton
                                imageName="people.jpg"
                                textcolor={Constants.COLOR_BLACK}
                                color={Constants.COLOR_WHITE}
                                text={t('personlist')}
                                iconName={Constants.ICON_USER_ALT}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_EXERCISES}>
                            <BigButton
                                imageName="exercises.PNG"
                                textcolor={Constants.COLOR_BLACK}
                                color="#ef7c1a"
                                text={t('exercises')}
                                iconName={Constants.ICON_RUNNING}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                    </Row>
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_LINKSLIST}>
                            <BigButton
                                imageName="links.jpg"
                                textcolor={Constants.COLOR_BLACK}
                                color={Constants.COLOR_WHITE}
                                text={t('links_list')}
                                iconName={Constants.ICON_EXTERNAL_LINK_ALT}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_BMICALCULATOR}>
                            <BigButton
                                imageName="calculator.PNG"
                                textcolor={Constants.COLOR_BLACK}
                                text={t('bmi_calculator')}
                                iconName={Constants.ICON_WEIGHT}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_RECIPES}>
                            <BigButton
                                imageName="recipes.png"
                                textcolor={Constants.COLOR_BLACK}
                                color="#b37401"
                                text={t('recipes')}
                                iconName={Constants.ICON_UTENSILS}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_BACKPACKING}>
                            <BigButton
                                imageName="backpacking.jpg"
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('backpacking')}
                                iconName={Constants.ICON_CAMPGROUND}
                                onClick={() => setFromActions()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={Constants.SESSION_DASHBOARD_LISTS} title={t('title_lists')}>
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_PROGRAMMING}>
                            <BigButton
                                imageName="programming.jpg"
                                iconName={Constants.ICON_LAPTOP}
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('programming')}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_SHOPPINGLISTS}>
                            <BigButton
                                imageName="shoppinglists.png"
                                textcolor={Constants.COLOR_BLACK}
                                color="#fcba03"
                                text={t('shoppinglists')}
                                iconName={Constants.ICON_CHECK_SQUARE}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_TASKLISTS}>
                            <BigButton
                                imageName="tasklists.PNG"
                                textcolor={Constants.COLOR_BLACK}
                                color="#fcba03"
                                text={t('tasklists')}
                                iconName={Constants.ICON_CHECK_SQUARE}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_LISTS}>
                            <BigButton
                                textcolor={Constants.COLOR_BLACK}
                                color={Constants.COLOR_WHITE}
                                text={t('other_lists')}
                                onClick={() => setFromLists()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={Constants.SESSION_DASHBOARD_MEDIA} title={t('title_media')}>
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_MOVIES}>
                            <BigButton
                                imageName="movies.jpg"
                                iconName={Constants.ICON_MOVIE}
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('movies')}
                                onClick={() => setFromMedia()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_GAMES}>
                            <BigButton
                                imageName="games.jpg"
                                iconName={Constants.ICON_GAMEPAD}
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('games')}
                                onClick={() => setFromMedia()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_DISC_GOLF}>
                            <BigButton
                                imageName="discgolf.jpg"
                                iconName={Constants.ICON_GAMEPAD}
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('discgolf')}
                                onClick={() => setFromMedia()}
                            />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey={Constants.SESSION_DASHBOARD_MUSIC} title={t('title_music')}>
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_MUSIC_BANDS}>
                            <BigButton
                                imageName="bands.jpg"
                                iconName={Constants.ICON_MUSIC}
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('music_bands')}
                                onClick={() => setFromMusic()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_MUSIC_RECORDS}>
                            <BigButton
                                imageName="music.jpg"
                                iconName={Constants.ICON_MUSIC}
                                textcolor={Constants.COLOR_BLACK}
                                color="#0cb058"
                                text={t('music_records')}
                                onClick={() => setFromMusic()}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_MUSIC_EVENTS}>
                            <BigButton
                                imageName="events.jpg"
                                iconName={Constants.ICON_MUSIC}
                                textcolor={Constants.COLOR_BLACK}
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
