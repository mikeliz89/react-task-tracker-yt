import BigButton from '../components/BigButton';
import { useTranslation } from 'react-i18next';
import { Row, Tabs } from 'react-bootstrap';
import PageContentWrapper from './Site/PageContentWrapper';
import * as Constants from '../utils/Constants';
import DashboardItem from './DashboardItem';
import { Tab } from 'bootstrap';

export default function Dashboard() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DASHBOARD, { keyPrefix: Constants.TRANSLATION_DASHBOARD_BUTTONS });

    return (
        <PageContentWrapper>

            <Tabs defaultActiveKey="actions" id="dashboard-Tab"
                className="mb-3">
                <Tab eventKey="actions" title="Toiminnot">
                    {/* Create New Row For Sets of 4 buttons  */}
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_CAR}>
                            <BigButton
                                imageName="car.jpg"
                                textcolor="black"
                                color="#0cb058"
                                text={t('car')}
                                iconName={Constants.ICON_CAR} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_DRINKS}>
                            <BigButton
                                imageName="cocktail.jpg"
                                textcolor="black"
                                color="#f9a9d5"
                                text={t('drinks')}
                                iconName={Constants.ICON_GLASS_MARTINI} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_PEOPLE}>
                            <BigButton
                                imageName="personlist.jpg"
                                textcolor="black"
                                color="white"
                                text={t('personlist')}
                                iconName={Constants.ICON_USER_ALT} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_EXERCISES}>
                            <BigButton
                                imageName="exercises.PNG"
                                textcolor="black"
                                color="#ef7c1a"
                                text={t('exercises')}
                                iconName={Constants.ICON_RUNNING} />
                        </DashboardItem>
                    </Row>
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_LINKSLIST}>
                            <BigButton
                                imageName="links.jpg"
                                textcolor="black"
                                color="white"
                                text={t('links_list')}
                                iconName={Constants.ICON_EXTERNAL_LINK_ALT} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_BMICALCULATOR}>
                            <BigButton
                                imageName="calculator.PNG"
                                textcolor="black"
                                text={t('bmi_calculator')}
                                iconName={Constants.ICON_WEIGHT} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_RECIPES}>
                            <BigButton
                                imageName="recipes.png"
                                textcolor="black"
                                color="#b37401"
                                text={t('recipes')}
                                iconName={Constants.ICON_UTENSILS}
                            />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_BACKPACKING}>
                            <BigButton
                                imageName="backpacking.jpg"
                                textcolor="black"
                                color="#0cb058"
                                text={t('backpacking')}
                                iconName={Constants.ICON_CAMPGROUND} />
                        </DashboardItem>
                    </Row>
                </Tab>
                <Tab eventKey="lists" title="Listat">
                    <Row>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_PROGRAMMING}>
                            <BigButton
                                imageName="programming.jpg"
                                iconName={Constants.ICON_LAPTOP}
                                textcolor="black"
                                color="#0cb058"
                                text={t('programming')} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MOVIES}>
                            <BigButton
                                imageName="movies.jpg"
                                iconName={Constants.ICON_MOVIE}
                                textcolor="black"
                                color="#0cb058"
                                text={t('movies')} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_MUSIC}>
                            <BigButton
                                imageName="music.jpg"
                                iconName={Constants.ICON_MUSIC}
                                textcolor="black"
                                color="#0cb058"
                                text={t('music')} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_GAMES}>
                            <BigButton
                                imageName="games.jpg"
                                iconName={Constants.ICON_GAMEPAD}
                                textcolor="black"
                                color="#0cb058"
                                text={t('games')} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_SHOPPINGLISTS}>
                            <BigButton
                                imageName="shoppinglists.png"
                                textcolor="black"
                                color="#fcba03"
                                text={t('shoppinglists')}
                                iconName={Constants.ICON_CHECK_SQUARE} />
                        </DashboardItem>
                        <DashboardItem link={Constants.NAVIGATION_MANAGE_TASKLISTS}>
                            <BigButton
                                imageName="tasklists.PNG"
                                textcolor="black"
                                color="#fcba03"
                                text={t('tasklists')}
                                iconName={Constants.ICON_CHECK_SQUARE} />
                        </DashboardItem>
                        {/* <DashboardItem link={Constants.NAVIGATION_MOVIES}>
                            <BigButton
                                textcolor="black"
                                color="white"
                                iconName='add'
                                text={t('add_new')} />
                        </DashboardItem> */}
                        {<DashboardItem link={Constants.NAVIGATION_MANAGE_LISTS}>
                            <BigButton
                                textcolor="black"
                                color="white"
                                text={t('other_lists')} />
                        </DashboardItem>}
                    </Row>
                </Tab>
            </Tabs>


        </PageContentWrapper>
    )
}
