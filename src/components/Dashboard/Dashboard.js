import BigButton from '../Buttons/BigButton';
import Icon from '../Icon';
import { useTranslation } from 'react-i18next';
import { Row, Tabs, Form } from 'react-bootstrap';
import PageContentWrapper from '../Site/PageContentWrapper';
import { TRANSLATION, ICONS, COLORS, NAVIGATION, SESSIONSTORAGE } from '../../utils/Constants';
import DashboardItem from './DashboardItem';
import { Tab } from 'bootstrap';
import { useState, useEffect } from 'react';

export default function Dashboard() {

    const [fromPage, setFromPage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const searchText = searchQuery.trim().toLowerCase();
    const isVisible = (text) => !searchText || text.toLowerCase().includes(searchText);

    const frequentlyUsedItems = [
        {
            link: NAVIGATION.CAR,
            imageName: 'car.jpg',
            text: t('car'),
            iconName: ICONS.CAR,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_DRINKS,
            imageName: 'cocktail.jpg',
            text: t('drinks'),
            iconName: ICONS.GLASS_MARTINI,
            color: '#f9a9d5',
            textcolor: COLORS.BLACK
        }
    ];

    const allCategoryItems = [
        {
            link: NAVIGATION.MANAGE_PEOPLE,
            imageName: 'people.jpg',
            text: t('personlist'),
            iconName: ICONS.USER_ALT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_EXERCISES,
            imageName: 'exercises.PNG',
            text: t('exercises'),
            iconName: ICONS.RUNNING,
            color: '#ef7c1a',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.LINKSLIST,
            imageName: 'links.jpg',
            text: t('links_list'),
            iconName: ICONS.EXTERNAL_LINK_ALT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.BMICALCULATOR,
            imageName: 'calculator.PNG',
            text: t('bmi_calculator'),
            iconName: ICONS.WEIGHT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_RECIPES,
            imageName: 'recipes.png',
            text: t('recipes'),
            iconName: ICONS.UTENSILS,
            color: '#b37401',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_BACKPACKING,
            imageName: 'backpacking.jpg',
            text: t('backpacking'),
            iconName: ICONS.CAMPGROUND,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        }
    ];

    const listItems = [
        {
            link: NAVIGATION.MANAGE_PROGRAMMING,
            imageName: 'programming.jpg',
            text: t('programming'),
            iconName: ICONS.LAPTOP,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_SHOPPINGLISTS,
            imageName: 'shoppinglists.png',
            text: t('shoppinglists'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#fcba03',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_TASKLISTS,
            imageName: 'tasklists.PNG',
            text: t('tasklists'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#fcba03',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_LISTS,
            imageName: 'otherlists.PNG',
            text: t('other_lists'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#fcba03',
            textcolor: COLORS.BLACK
        }
    ];

    const moviesItems = [
        {
            link: NAVIGATION.MANAGE_MOVIES,
            imageName: 'movies.jpg',
            text: t('movies'),
            iconName: ICONS.MOVIE,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        }
    ];

    const gamesItems = [
        {
            link: NAVIGATION.MANAGE_GAMES,
            imageName: 'games.jpg',
            text: t('games'),
            iconName: ICONS.GAMEPAD,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_DISC_GOLF,
            imageName: 'discgolf.jpg',
            text: t('discgolf'),
            iconName: ICONS.GAMEPAD,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        }
    ];

    const musicItems = [
        {
            link: NAVIGATION.MANAGE_MUSIC_BANDS,
            imageName: 'bands.jpg',
            text: t('music_bands'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_MUSIC_RECORDS,
            imageName: 'music.jpg',
            text: t('music_records'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_MUSIC_EVENTS,
            imageName: 'events.jpg',
            text: t('music_events'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        {
            link: NAVIGATION.MANAGE_MUSIC_KARAOKE_SONGS,
            imageName: 'events.jpg',
            text: t('music_karaoke_songs'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        }
    ];

    const renderButtons = (items) => items
        .filter(item => isVisible(item.text))
        .map(item => (
            <DashboardItem key={item.text} link={item.link}>
                <BigButton
                    imageName={item.imageName}
                    textcolor={item.textcolor}
                    color={item.color}
                    text={item.text}
                    iconName={item.iconName}
                    onClick={() => setSessionStorage(fromPage)}
                />
            </DashboardItem>
        ));

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <div className="dashboard-header">
                <Tabs
                    activeKey={fromPage}
                    onSelect={(key) => {
                        setFromPage(key);
                        setSessionStorage(key);
                    }}
                    id="dashboard-Tab"
                    className="mb-3"
                >
                    <Tab eventKey={SESSIONSTORAGE.DASHBOARD_ACTIONS} title={t('title_actions')}>
                        <section>
                            <h3>{t('title_frequently_used')}</h3>
                            <Row>
                                {renderButtons(frequentlyUsedItems)}
                            </Row>
                        </section>
                        <section>
                            <h3>Kaikki kategoriat</h3>
                            <Row>
                                {renderButtons(allCategoryItems)}
                            </Row>
                        </section>
                    </Tab>
                    <Tab eventKey={SESSIONSTORAGE.DASHBOARD_LISTS} title={t('title_lists')}>
                        <Row>
                            {renderButtons(listItems)}
                        </Row>
                    </Tab>
                    <Tab eventKey={SESSIONSTORAGE.DASHBOARD_MOVIES} title={t('title_movies')}>
                        <Row>
                            {renderButtons(moviesItems)}
                        </Row>
                    </Tab>
                    <Tab eventKey={SESSIONSTORAGE.DASHBOARD_GAMES} title={t('title_games')}>
                        <Row>
                            {renderButtons(gamesItems)}
                        </Row>
                    </Tab>
                    <Tab eventKey={SESSIONSTORAGE.DASHBOARD_MUSIC} title={t('title_music')}>
                        <Row>
                            {renderButtons(musicItems)}
                        </Row>
                    </Tab>
                </Tabs>
                <div className="dashboard-search-input">
                    <Icon name={ICONS.SEARCH} color="#8f9bb3" fontSize="1rem" className="dashboard-search-icon" />
                    <Form.Control
                        className="dashboard-search-control"
                        placeholder={t('search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </PageContentWrapper>
    );
}