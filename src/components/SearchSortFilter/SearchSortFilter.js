import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';
import { useToggle } from '../Hooks/useToggle';

import FilterCheckBox from './FilterCheckBox';
import FilterDropDown from './FilterDropDown';
import { FilterMode } from './FilterModes';
import SearchTextInput from './SearchTextInput';
import SortByButton from './SortByButton';
import { SortMode } from './SortModes';

const ReadyFilterMode = {
    All: 'all',
    Ready: 'ready',
    NotReady: 'not_ready'
}

const RatedFilterMode = {
    All: 'all',
    Rated: 'rated',
    NotRated: 'not_rated'
}

const HomeFilterMode = {
    All: 'all',
    Have: 'have',
    NotHave: 'not_have'
}

const SeenLiveFilterMode = {
    All: 'all',
    Seen: 'seen',
    NotSeen: 'not_seen'
}

const filterCheckText = (newList, key, comparableString) => {
    const needle = String(comparableString).toLowerCase();
    return newList.filter(x =>
        x[key] != null && String(x[key]).toLowerCase().includes(needle)
    );
};

const filterCheckAnyText = (newList, keys, comparableString) => {
    const needle = String(comparableString).toLowerCase();
    return newList.filter(x =>
        keys.some(key => x[key] != null && String(x[key]).toLowerCase().includes(needle))
    );
};

const filterCheckTrue = (newList, key) => {
    return newList.filter(x => x[key] === true);
}

const filterCheckFalse = (newList, key) => {
    return newList.filter(x => x[key] === false || !x[key]);
}

const filterCheckIntMoreThanZero = (newList, key) => {
    return newList.filter(x => x[key] !== undefined && x[key] > 0);
}

const filterCheckIntZero = (newList, key) => {
    return newList.filter(x => x[key] === undefined || x[key] === 0);
}

const sortByText = (newList, key) => {
    return [...newList].sort((a, b) => {
        return a[key].toLowerCase() > b[key].toLowerCase() ? 1 : -1
    });
}

const sortByDate = (newList, key) => {
    return [...newList].sort(
        (a, b) => new Date(a[key]).setHours(0, 0, 0, 0) - new Date(b[key]).setHours(0, 0, 0, 0)
    );
}

const sortByInt = (newList, key) => {
    return [...newList].sort((a, b) => {
        let aCount = a[key] === undefined ? 0 : a[key];
        let bCount = b[key] === undefined ? 0 : b[key];
        return aCount - bCount;
    });
}

export default function SearchSortFilter({ onSet,
    originalList,
    //sorting
    defaultSort,
    showSortByName,
    showSortByTitle,
    showSortByCreatedDate,
    showSortByText,
    showSortByStarRating,
    showSortByBirthday,
    showSortByPublishYear,
    //searching
    showSearchByText,
    showSearchByFinnishName,
    showSearchByDescription,
    showSearchByDay,
    showSearchByIncredients,
    //filtering
    showFilterSeenLive,
    showFilterHaveAtHome,
    showFilterHaveRated,
    showFilterCore,
    showFilterReady,
    //filtermode
    filterMode
}) {

    //details open state
    const { status: showAllToggle, toggleStatus: toggleShowAll } = useToggle(true);
    const [showAll, setShowAll] = useState(showAllToggle);

    //search states
    const [searchString, setSearchString] = useState('');
    const [searchStringFinnishName, setSearchStringFinnishName] = useState('');
    const [searchStringDescription, setSearchStringDescription] = useState('');
    const [searchStringDay, setSearchStringDay] = useState('');
    const [searchStringIncredients, setSearchStringIncredients] = useState('');
    //sort states
    const [sortBy, setSortBy] = useState(defaultSort);
    //filter states
    const [seenLiveFilterMode, setSeenLiveFilterMode] = useState(SeenLiveFilterMode.All);
    const [homeFilterMode, setHomeFilterMode] = useState(HomeFilterMode.All);
    const [ratedFilterMode, setRatedFilterMode] = useState(RatedFilterMode.All);
    const [showOnlyCore, setShowOnlyCore] = useState(false);
    const [readyFilterMode, setReadyFilterMode] = useState(ReadyFilterMode.All);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });

    const searching = useCallback((newList) => {
        if (searchString !== "") {
            switch (filterMode) {
                case FilterMode.Name:
                    newList = filterCheckText(newList, "name", searchString);
                    break;
                case FilterMode.NameOrBand:
                    newList = filterCheckAnyText(newList, ["name", "band"], searchString);
                    break;
                case FilterMode.Text:
                    newList = filterCheckText(newList, "text", searchString);
                    break;
                case FilterMode.Title:
                    newList = filterCheckText(newList, "title", searchString);
                    break;
                default:
                    break;
            }
        }
        if (searchStringFinnishName !== "") {
            newList = filterCheckText(newList, "nameFi", searchStringFinnishName);
        }
        if (searchStringIncredients !== "") {
            newList = filterCheckText(newList, "incredients", searchStringIncredients);
        }
        if (searchStringDescription !== "") {
            newList = filterCheckText(newList, "description", searchStringDescription);
        }
        if (searchStringDay !== "") {
            newList = filterCheckText(newList, "day", searchStringDay);
        }
        return newList;
    }, [
        searchString,
        filterMode,
        searchStringFinnishName,
        searchStringIncredients,
        searchStringDescription,
        searchStringDay
    ]);

    const filtering = useCallback((newList) => {

        //have at home status
        if (homeFilterMode === HomeFilterMode.Have) {
            newList = filterCheckTrue(newList, "haveAtHome");
        }
        if (homeFilterMode === HomeFilterMode.NotHave) {
            newList = filterCheckFalse(newList, "haveAtHome");
        }
        //seen live status
        if (seenLiveFilterMode === SeenLiveFilterMode.Seen) {
            newList = filterCheckTrue(newList, "seenLive");
        }
        if (seenLiveFilterMode === SeenLiveFilterMode.NotSeen) {
            newList = filterCheckFalse(newList, "seenLive");
        }
        //rated status
        if (ratedFilterMode === RatedFilterMode.Rated) {
            newList = filterCheckIntMoreThanZero(newList, "stars");
        }
        if (ratedFilterMode === RatedFilterMode.NotRated) {
            newList = filterCheckIntZero(newList, "stars");
        }
        //core
        if (showOnlyCore) {
            newList = filterCheckTrue(newList, "isCore");
        }
        //ready status
        if (readyFilterMode === ReadyFilterMode.Ready) {
            newList = filterCheckTrue(newList, "reminder");
        }
        if (readyFilterMode === ReadyFilterMode.NotReady) {
            newList = filterCheckFalse(newList, "reminder");
        }

        return newList;
    }, [homeFilterMode, seenLiveFilterMode, ratedFilterMode, showOnlyCore, readyFilterMode]);

    const sorting = useCallback((newList) => {

        switch (sortBy) {
            case SortMode.Name_ASC:
            case SortMode.Name_DESC:
                newList = sortByText(newList, "name");
                if (sortBy === SortMode.Name_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Title_ASC:
            case SortMode.Title_DESC:
                newList = sortByText(newList, "title");
                if (sortBy === SortMode.Title_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Created_ASC:
            case SortMode.Created_DESC:
                newList = sortByDate(newList, "created");
                if (sortBy === SortMode.Created_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Text_ASC:
            case SortMode.Text_DESC:
                newList = sortByText(newList, "text");
                if (sortBy === SortMode.Text_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.StarRating_ASC:
            case SortMode.StarRating_DESC:
                newList = sortByInt(newList, "stars");
                if (sortBy === SortMode.StarRating_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.PublishYear_ASC:
            case SortMode.PublishYear_DESC:
                newList = sortByInt(newList, "publishYear");
                if (sortBy === SortMode.PublishYear_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Birthday_ASC:
            case SortMode.Birthday_DESC:
                newList = sortByDate(newList, "birthday");
                if (sortBy === SortMode.Birthday_DESC) {
                    newList.reverse();
                }
                break;
            default:
                break;
        }
        return newList;
    }, [sortBy]);

    const filterAndSort = useCallback(() => {
        if (!Array.isArray(originalList) || originalList.length === 0) return;

        let newList = originalList;
        newList = searching(newList);
        newList = filtering(newList);
        newList = sorting(newList);
        onSet(newList);
    }, [originalList, onSet, searching, filtering, sorting]);

    useEffect(() => {
        setSortBy(defaultSort);
    }, [defaultSort]);

    useEffect(() => {
        filterAndSort();
    }, [filterAndSort]);

    useEffect(() => {
        setShowAll(showAllToggle);
    }, [showAllToggle]);

    return (
        <>
            <details
                open={showAll}
                onToggle={(e) => {
                    const isOpen = e.currentTarget.open;
                    setShowAll(isOpen);
                    if (isOpen !== showAllToggle) {
                        toggleShowAll();
                    }
                }}
            >
                <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: 8 }}>
                    {t('search_tools')}
                </summary>
                <div className="searchSortFilter">
                    <Form className='form-no-paddings'>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <ButtonGroup>
                                    {
                                        showSortByCreatedDate &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.Created_ASC}
                                            sortModeDESC={SortMode.Created_DESC}
                                            onSortBy={setSortBy}
                                            title='created_date' />
                                    }
                                    {
                                        showSortByName &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.Name_ASC}
                                            sortModeDESC={SortMode.Name_DESC}
                                            onSortBy={setSortBy}
                                            title='name' />
                                    }
                                    {
                                        showSortByTitle &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.Title_ASC}
                                            sortModeDESC={SortMode.Title_DESC}
                                            onSortBy={setSortBy}
                                            title='title' />
                                    }
                                    {
                                        showSortByText &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.Text_ASC}
                                            sortModeDESC={SortMode.Text_DESC}
                                            onSortBy={setSortBy}
                                            title='text' />
                                    }
                                    {
                                        showSortByStarRating &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.StarRating_ASC}
                                            sortModeDESC={SortMode.StarRating_DESC}
                                            onSortBy={setSortBy}
                                            title='star_rating' />
                                    }
                                    {
                                        showSortByBirthday &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.Birthday_ASC}
                                            sortModeDESC={SortMode.Birthday_DESC}
                                            onSortBy={setSortBy}
                                            title='birthday' />
                                    }
                                    {
                                        showSortByPublishYear &&
                                        <SortByButton
                                            sortBy={sortBy}
                                            sortModeASC={SortMode.PublishYear_ASC}
                                            sortModeDESC={SortMode.PublishYear_DESC}
                                            onSortBy={setSortBy}
                                            title='publishYear' />
                                    }
                                </ButtonGroup>
                            </Col>
                        </Form.Group>
                        {
                            showSearchByText &&
                            <SearchTextInput
                                setSearchString={setSearchString}
                                placeholderText='placeholder_name'
                            />
                        }
                        {
                            showSearchByFinnishName &&
                            <SearchTextInput
                                setSearchString={setSearchStringFinnishName}
                                placeholderText='placeholder_finnishname'
                            />
                        }
                        {
                            showSearchByDescription &&
                            <SearchTextInput
                                setSearchString={setSearchStringDescription}
                                placeholderText='placeholder_description'
                            />
                        }
                        {
                            showSearchByDay &&
                            <SearchTextInput
                                setSearchString={setSearchStringDay}
                                placeholderText='placeholder_day'
                            />
                        }
                        {
                            showSearchByIncredients &&
                            <SearchTextInput
                                setSearchString={setSearchStringIncredients}
                                placeholderText='placeholder_incredients'
                            />
                        }
                        {
                            showFilterSeenLive &&
                            <FilterDropDown
                                id='seenLiveStatusFilter'
                                labelText='show_only_seen_live'
                                value={seenLiveFilterMode}
                                onSet={setSeenLiveFilterMode}
                                options={[
                                    { value: SeenLiveFilterMode.All, labelText: 'seen_live_filter_all' },
                                    { value: SeenLiveFilterMode.Seen, labelText: 'seen_live_filter_seen' },
                                    { value: SeenLiveFilterMode.NotSeen, labelText: 'seen_live_filter_not_seen' },
                                ]}
                            />
                        }
                        {
                            showFilterHaveAtHome &&
                            <FilterDropDown
                                id='haveAtHomeStatusFilter'
                                labelText='home_filter_have'
                                value={homeFilterMode}
                                onSet={setHomeFilterMode}
                                options={[
                                    { value: HomeFilterMode.All, labelText: 'home_filter_all' },
                                    { value: HomeFilterMode.Have, labelText: 'home_filter_have' },
                                    { value: HomeFilterMode.NotHave, labelText: 'home_filter_not_have' },
                                ]}
                            />
                        }
                        {
                            showFilterHaveRated &&
                            <FilterDropDown
                                id='ratedStatusFilter'
                                labelText='rated'
                                value={ratedFilterMode}
                                onSet={setRatedFilterMode}
                                options={[
                                    { value: RatedFilterMode.All, labelText: 'rated_filter_all' },
                                    { value: RatedFilterMode.Rated, labelText: 'rated_filter_rated' },
                                    { value: RatedFilterMode.NotRated, labelText: 'rated_filter_not_rated' },
                                ]}
                            />
                        }
                        {
                            showFilterCore &&
                            <FilterCheckBox
                                onSet={setShowOnlyCore}
                                labelText='show_only_core'
                                id='iscore'
                            />
                        }
                        {
                            showFilterReady &&
                            <FilterDropDown
                                id='readyStatusFilter'
                                labelText='ready'
                                value={readyFilterMode}
                                onSet={setReadyFilterMode}
                                options={[
                                    { value: ReadyFilterMode.All, labelText: 'ready_filter_all' },
                                    { value: ReadyFilterMode.Ready, labelText: 'ready_filter_ready' },
                                    { value: ReadyFilterMode.NotReady, labelText: 'ready_filter_not_ready' },
                                ]}
                            />
                        }
                    </Form>
                </div>
            </details>
        </>
    )
}

SearchSortFilter.defaultProps = {
    //list
    originalList: null,
    //sorting
    defaultSort: SortMode.Created_ASC,
    showSortByName: false,
    showSortByTitle: false,
    showSortByCreatedDate: false,
    showSortByText: false,
    showSortByStarRating: false,
    showSortByBirthday: false,
    showSortByPublishYear: false,
    //searching
    showSearchByText: false,
    showSearchByFinnishName: false,
    showSearchByDescription: false,
    showSearchByIncredients: false,
    showSearchByDay: false,
    //filtering
    filterMode: FilterMode.Name,
    showFilterSeenLive: false,
    showFilterHaveAtHome: false,
    showFilterHaveRated: false,
    showFilterCore: false,
    showFilterReady: false
}

SearchSortFilter.propTypes = {
    //sorting
    defaultSort: PropTypes.string,
    showSortByPublishYear: PropTypes.bool,
    showSortByBirthday: PropTypes.bool,
    showSortByName: PropTypes.bool,
    showSortByTitle: PropTypes.bool,
    showSortByCreatedDate: PropTypes.bool,
    showSortByText: PropTypes.bool,
    showSortByStarRating: PropTypes.bool,
    //searching
    showSearchByText: PropTypes.bool,
    showSearchByFinnishName: PropTypes.bool,
    showSearchByDescription: PropTypes.bool,
    showSearchByIncredients: PropTypes.bool,
    showSearchByDay: PropTypes.bool,
    //filtering
    filterMode: PropTypes.string,
    showFilterSeenLive: PropTypes.bool,
    showFilterHaveAtHome: PropTypes.bool,
    showFilterHaveRated: PropTypes.bool,
    showFilterCore: PropTypes.bool,
    showFilterReady: PropTypes.bool,
    //other
    onSet: PropTypes.func
}


