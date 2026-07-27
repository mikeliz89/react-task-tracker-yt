import { useState, useEffect } from 'react';
import { Row, Tabs, Tab, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS, COLORS, NAVIGATION, SESSIONSTORAGE } from '../../utils/Constants';
import BigButton from '../Buttons/BigButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';

import DashboardItem from './DashboardItem';
import SearchTextInput from './SearchTextInput';

export default function Dashboard() {

    const [fromPage, setFromPage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showComingSoon, setShowComingSoon] = useState(false);

    //translation
    const { t } = useTranslation(TRANSLATION.DASHBOARD, { keyPrefix: TRANSLATION.DASHBOARD_BUTTONS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    const setSessionStorage = (value) => {
        sessionStorage.setItem(SESSIONSTORAGE.FROM_PAGE, value);
    };

    const searchText = searchQuery.trim().toLowerCase();
    const hasSearch = searchText.length > 0;
    const isVisible = (text) => !searchText || text.toLowerCase().includes(searchText);
    const isComingSoonVisible = (item) => !item.comingsoon || showComingSoon;
    const isItemVisible = (item) => isComingSoonVisible(item) && isVisible(item.text);

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
        reminders: {
            link: NAVIGATION.MANAGE_REMINDERS,
            imageName: 'otherlists.PNG',
            text: t('reminders'),
            iconName: ICONS.BELL,
            color: '#fcba03',
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
            imageName: 'links.png',
            text: t('links_list'),
            iconName: ICONS.EXTERNAL_LINK_ALT,
            color: COLORS.WHITE,
            textcolor: COLORS.BLACK
        },
        finance: {
            link: NAVIGATION.MANAGE_FINANCE,
            imageName: 'finance.PNG',
            text: t('finance'),
            iconName: ICONS.LIST_ALT,
            color: '#fcba03',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        housing: {
            link: NAVIGATION.MANAGE_HOUSING,
            imageName: 'housing.PNG',
            text: t('housing'),
            iconName: ICONS.HOME,
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
        wellbeingGoals: {
            link: NAVIGATION.MANAGE_WELLBEING_GOALS,
            imageName: 'wellbeing-goals.PNG',
            text: t('wellbeing_goals'),
            iconName: ICONS.CHECK_SQUARE,
            color: '#ef7c1a',
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
        darts: {
            link: NAVIGATION.MANAGE_DARTS,
            imageName: 'darts.png',
            text: t('darts'),
            iconName: ICONS.GAMEPAD,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        crafts: {
            link: NAVIGATION.MANAGE_CRAFTS,
            imageName: 'crafts.png',
            text: t('crafts'),
            iconName: ICONS.GEAR,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        reading: {
            link: NAVIGATION.MANAGE_READING,
            imageName: 'reading.png',
            text: t('reading'),
            iconName: ICONS.BOOK,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        pets: {
            link: NAVIGATION.MANAGE_PETS,
            imageName: 'pets.png',
            text: t('pets'),
            iconName: ICONS.DOG,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        travel: {
            link: NAVIGATION.MANAGE_TRAVEL,
            imageName: 'travelling.png',
            text: t('travel'),
            iconName: ICONS.GLOBE,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        plantCare: {
            link: NAVIGATION.MANAGE_PLANT_CARE,
            imageName: 'plantcare.PNG',
            text: t('plant_care'),
            iconName: ICONS.CARROT,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
        },
        homeCare: {
            link: NAVIGATION.MANAGE_HOME_CARE,
            imageName: 'housecare.PNG',
            text: t('home_care'),
            iconName: ICONS.GEAR,
            color: '#0cb058',
            textcolor: COLORS.BLACK,
            comingsoon: true
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
            text: t('videogames'),
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
            imageName: 'karaokesongs.png',
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
            iconName: ICONS.LIST_ALT,
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
                    items: [
                        dashboardItems.car,
                        dashboardItems.finance,
                        dashboardItems.housing,
                        dashboardItems.homeCare
                    ]
                },
                {
                    title: t('section_links'),
                    items: [dashboardItems.links]
                },
                {
                    title: t('section_lifestyle'),
                    items: [
                        dashboardItems.reading,
                        dashboardItems.pets,
                        dashboardItems.travel,
                        dashboardItems.plantCare
                    ]
                }
            ]
        },
        {
            key: 'wellbeing',
            title: t('title_wellbeing'),
            iconName: ICONS.RUNNING,
            sections: [
                {
                    title: t('section_exercise'),
                    items: [dashboardItems.exercises]
                },
                {
                    title: t('section_body_metrics'),
                    items: [dashboardItems.bmi]
                },
                {
                    title: t('section_wellbeing_goals'),
                    items: [dashboardItems.wellbeingGoals]
                }
            ]
        },
        {
            key: 'food-and-drink',
            title: t('title_food_and_drink'),
            iconName: ICONS.UTENSILS,
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
            iconName: ICONS.CAMPGROUND,
            sections: [
                {
                    title: t('section_outdoor_hobbies'),
                    items: [dashboardItems.backpacking, dashboardItems.discGolf]
                },
                {
                    title: t('section_indoor_hobbies'),
                    items: [dashboardItems.darts, dashboardItems.crafts]
                }
            ]
        },
        {
            key: 'entertainment',
            title: t('title_entertainment'),
            iconName: ICONS.GAMEPAD,
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
            iconName: ICONS.BELL,
            sections: [
                {
                    title: t('section_people_and_birthdays'),
                    items: [dashboardItems.people, dashboardItems.reminders]
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
        .filter(item => isItemVisible(item))
        .map(item => (
            <DashboardItem key={item.text} link={item.link}>
                <BigButton
                    imageName={item.imageName}
                    textcolor={item.textcolor}
                    color={item.color}
                    text={item.text}
                    iconName={item.iconName}
                    comingsoon={item.comingsoon}
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
            items: group.items.filter(item => isItemVisible(item))
        }))
        .filter(group => group.items.length > 0);

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <div className="dashboard-header">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div className="flex-grow-1">
                        <SearchTextInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search')}
                        />
                    </div>

                    <Form.Check
                        id='showComingSoon'
                        type='checkbox'
                        label={t('show_coming_soon')}
                        checked={showComingSoon}
                        onChange={(e) => setShowComingSoon(e.target.checked)}
                    />
                </div>

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
                                            comingsoon={item.comingsoon}
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
                            <Tab
                                key={category.key}
                                eventKey={category.key}
                                title={<><Icon name={category.iconName} /> {category.title}</>}
                            >
                                {category.sections.map((section) => {
                                    const visibleItems = section.items.filter(item => isItemVisible(item));

                                    if (visibleItems.length === 0) {
                                        return null;
                                    }

                                    return (
                                        <section key={`${category.key}-${section.title}`}>
                                            <h3>{section.title}</h3>
                                            <Row>
                                                {renderButtons(visibleItems)}
                                            </Row>
                                        </section>
                                    );
                                })}
                            </Tab>
                        ))}
                    </Tabs>
                )}
            </div>
        </PageContentWrapper>
    );
}


