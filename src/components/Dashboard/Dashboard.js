import { useState, useEffect } from 'react';
import { Row, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS, COLORS, NAVIGATION, SESSIONSTORAGE } from '../../utils/Constants';
import BigButton from '../Buttons/BigButton';
import PageContentWrapper from '../Site/PageContentWrapper';

import DashboardItem from './DashboardItem';
import SearchTextInput from './SearchTextInput';

export default function Dashboard() {

    const [fromPage, setFromPage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    //translation
    const { t } = useTranslation(TRANSLATION.DASHBOARD, { keyPrefix: TRANSLATION.DASHBOARD_BUTTONS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    const setSessionStorage = (value) => {
        sessionStorage.setItem(SESSIONSTORAGE.FROM_PAGE, value);
    };

    const searchText = searchQuery.trim().toLowerCase();
    const hasSearch = searchText.length > 0;
    const isVisible = (text) => !searchText || text.toLowerCase().includes(searchText);

    const dashboardItems = {
        car: {
            link: NAVIGATION.MANAGE_CARS,
            imageName: 'car.jpg',
            text: t('car'),
            iconName: ICONS.CAR,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        people: {
            link: NAVIGATION.MANAGE_PEOPLE,
            imageName: 'people.jpg',
            text: t('personlist'),
            iconName: ICONS.USER_ALT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        programming: {
            link: NAVIGATION.MANAGE_PROGRAMMING,
            imageName: 'programming.jpg',
            text: t('programming'),
            iconName: ICONS.LAPTOP,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        shoppinglists: {
            link: NAVIGATION.MANAGE_SHOPPINGLISTS,
            imageName: 'shoppinglists.png',
            text: t('shoppinglists'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#fcba03',
            textcolor: COLORS.BLACK
        },
        tasklists: {
            link: NAVIGATION.MANAGE_TASKLISTS,
            imageName: 'tasklists.PNG',
            text: t('tasklists'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#fcba03',
            textcolor: COLORS.BLACK
        },
        otherLists: {
            link: NAVIGATION.MANAGE_LISTS,
            imageName: 'otherlists.PNG',
            text: t('other_lists'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#fcba03',
            textcolor: COLORS.BLACK
        },
        links: {
            link: NAVIGATION.LINKSLIST,
            imageName: 'links.jpg',
            text: t('links_list'),
            iconName: ICONS.EXTERNAL_LINK_ALT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        exercises: {
            link: NAVIGATION.MANAGE_EXERCISES,
            imageName: 'exercises.PNG',
            text: t('exercises'),
            iconName: ICONS.RUNNING,
            color: '#ef7c1a',
            textcolor: COLORS.BLACK
        },
        bmi: {
            link: NAVIGATION.BMICALCULATOR,
            imageName: 'calculator.PNG',
            text: t('bmi_calculator'),
            iconName: ICONS.WEIGHT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        recipes: {
            link: NAVIGATION.MANAGE_RECIPES,
            imageName: 'recipes.png',
            text: t('recipes'),
            iconName: ICONS.UTENSILS,
            color: '#b37401',
            textcolor: COLORS.BLACK
        },
        drinks: {
            link: NAVIGATION.MANAGE_DRINKS,
            imageName: 'cocktail.jpg',
            text: t('drinks'),
            iconName: ICONS.GLASS_MARTINI,
            color: '#f9a9d5',
            textcolor: COLORS.BLACK
        },
        backpacking: {
            link: NAVIGATION.MANAGE_BACKPACKING,
            imageName: 'backpacking.jpg',
            text: t('backpacking'),
            iconName: ICONS.CAMPGROUND,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        discGolf: {
            link: NAVIGATION.MANAGE_DISC_GOLF,
            imageName: 'discgolf.jpg',
            text: t('discgolf'),
            iconName: ICONS.GAMEPAD,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        movies: {
            link: NAVIGATION.MANAGE_MOVIES,
            imageName: 'movies.jpg',
            text: t('movies'),
            iconName: ICONS.MOVIE,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        games: {
            link: NAVIGATION.MANAGE_GAMES,
            imageName: 'games.jpg',
            text: t('games'),
            iconName: ICONS.GAMEPAD,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        boardGames: {
            link: NAVIGATION.MANAGE_BOARD_GAMES,
            imageName: 'boardgames.png',
            text: t('board_games'),
            iconName: ICONS.GAMEPAD,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        musicBands: {
            link: NAVIGATION.MANAGE_MUSIC_BANDS,
            imageName: 'bands.jpg',
            text: t('music_bands'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        musicRecords: {
            link: NAVIGATION.MANAGE_MUSIC_RECORDS,
            imageName: 'records.png',
            text: t('music_records'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        musicEvents: {
            link: NAVIGATION.MANAGE_MUSIC_EVENTS,
            imageName: 'events.jpg',
            text: t('music_events'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        },
        karaoke: {
            link: NAVIGATION.MANAGE_MUSIC_KARAOKE_SONGS,
            imageName: 'events.jpg',
            text: t('music_karaoke_songs'),
            iconName: ICONS.MUSIC,
            color: '#0cb058',
            textcolor: COLORS.BLACK
        }
    };

    const dashboardCategories = [
        {
            key: 'daily-management',
            title: t('title_daily_management'),
            sections: [
                {
                    title: t('section_lists_and_tasks'),
                    items: [
                        dashboardItems.shoppinglists,
                        dashboardItems.tasklists,
                        dashboardItems.otherLists,
                        dashboardItems.programming
                    ]
                },
                {
                    title: t('section_mobility'),
                    items: [dashboardItems.car]
                },
                {
                    title: t('section_links'),
                    items: [dashboardItems.links]
                }
            ]
        },
        {
            key: 'wellbeing',
            title: t('title_wellbeing'),
            sections: [
                {
                    title: t('section_exercise'),
                    items: [dashboardItems.exercises]
                },
                {
                    title: t('section_body_metrics'),
                    items: [dashboardItems.bmi]
                }
            ]
        },
        {
            key: 'food-and-drink',
            title: t('title_food_and_drink'),
            sections: [
                {
                    title: t('section_food'),
                    items: [dashboardItems.recipes]
                },
                {
                    title: t('section_drinks'),
                    items: [dashboardItems.drinks]
                }
            ]
        },
        {
            key: 'hobbies-and-leisure',
            title: t('title_hobbies_and_leisure'),
            sections: [
                {
                    title: t('section_outdoor_hobbies'),
                    items: [dashboardItems.backpacking, dashboardItems.discGolf]
                }
            ]
        },
        {
            key: 'entertainment',
            title: t('title_entertainment'),
            sections: [
                {
                    title: t('section_movies_and_games'),
                    items: [
                        dashboardItems.movies,
                        dashboardItems.games,
                        dashboardItems.boardGames
                    ]
                },
                {
                    title: t('section_music_and_karaoke'),
                    items: [
                        dashboardItems.musicBands,
                        dashboardItems.musicRecords,
                        dashboardItems.musicEvents,
                        dashboardItems.karaoke
                    ]
                }
            ]
        },
        {
            key: 'reminders-and-events',
            title: t('title_reminders_and_events'),
            sections: [
                {
                    title: t('section_people_and_birthdays'),
                    items: [dashboardItems.people]
                }
            ]
        }
    ];

    useEffect(() => {
        const validCategoryKeys = dashboardCategories.map(x => x.key);
        const defaultCategory = dashboardCategories[0].key;

        // Access fromPage from session storage
        let fromPageSession = sessionStorage.getItem(SESSIONSTORAGE.FROM_PAGE);
        if (!fromPageSession || !validCategoryKeys.includes(fromPageSession)) {
            fromPageSession = defaultCategory;
        }

        // Update session storage
        setSessionStorage(fromPageSession);
        setFromPage(fromPageSession);

        setLoading(false);
    }, [dashboardCategories]);

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

    const searchGroups = dashboardCategories.map((category) => ({
        ...category,
        items: category.sections.flatMap((section) => section.items)
    }));

    const filteredSearchGroups = searchGroups
        .map(group => ({
            ...group,
            items: group.items.filter(item => isVisible(item.text))
        }))
        .filter(group => group.items.length > 0);

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <div className="dashboard-header">
                <SearchTextInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search')}
                />

                {hasSearch ? (
                    filteredSearchGroups.map((group) => (
                        <section key={group.key}>
                            <h3>{group.title}</h3>
                            <Row>
                                {group.items.map(item => (
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
                                ))}
                            </Row>
                        </section>
                    ))
                ) : (
                    <Tabs
                        activeKey={fromPage}
                        onSelect={(key) => {
                            setFromPage(key);
                            setSessionStorage(key);
                        }}
                        id="dashboard-Tab"
                        className="mb-3"
                    >
                        {dashboardCategories.map((category) => (
                            <Tab key={category.key} eventKey={category.key} title={category.title}>
                                {category.sections.map((section) => (
                                    <section key={`${category.key}-${section.title}`}>
                                        <h3>{section.title}</h3>
                                        <Row>
                                            {renderButtons(section.items)}
                                        </Row>
                                    </section>
                                ))}
                            </Tab>
                        ))}
                    </Tabs>
                )}
            </div>
        </PageContentWrapper>
    );
}


