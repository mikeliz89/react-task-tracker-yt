import { useState, useEffect } from 'react';
import { Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SortMode } from './SortModes';
import { FilterMode } from './FilterModes';
import PropTypes from 'prop-types';
import { TRANSLATION } from '../../utils/Constants';
import SortByButton from './SortByButton';
import SearchTextInput from './SearchTextInput';
import FilterCheckBox from './FilterCheckBox';
import Button from '../Buttons/Button';
import { useToggle } from '../Hooks/useToggle';
import Collapse from 'react-bootstrap/Collapse';

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
    showFilterNotHaveSeenLive,
    showFilterHaveAtHome,
    showFilterNotHaveAtHome,
    showFilterHaveRated,
    showFilterCore,
    showFilterReady,
    //filtermode
    filterMode
}) {

    //toggle
    const { status: showAll, toggleStatus: toggleShowAll } = useToggle(true);

    //search states
    const [searchString, setSearchString] = useState('');
    const [searchStringFinnishName, setSearchStringFinnishName] = useState('');
    const [searchStringDescription, setSearchStringDescription] = useState('');
    const [searchStringDay, setSearchStringDay] = useState('');
    const [searchStringIncredients, setSearchStringIncredients] = useState('');
    //sort states
    const [sortBy, setSortBy] = useState(defaultSort);
    //filter states
    const [showOnlySeenLive, setShowOnlySeenLive] = useState(false);
    const [showOnlyNotHaveSeenLive, setShowOnlyNotHaveSeenLive] = useState(false);
    const [showOnlyHaveAtHome, setShowOnlyHaveAtHome] = useState(false);
    const [showOnlyNotHaveAtHome, setShowOnlyNotHaveAtHome] = useState(false);
    const [ratedFilterMode, setRatedFilterMode] = useState(RatedFilterMode.All);
    const [showOnlyCore, setShowOnlyCore] = useState(false);
    const [readyFilterMode, setReadyFilterMode] = useState(ReadyFilterMode.All);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });

    // Aja filtteröinti + sorttaus aina kun originalList vaihtuu
    useEffect(() => {
        filterAndSort();
    }, [originalList]);

    useEffect(() => {
        setSortBy(defaultSort);
    }, [defaultSort]);

    useEffect(() => {
        filterAndSort();
    }, [sortBy,
        searchString, searchStringFinnishName, searchStringDescription,
        searchStringIncredients, searchStringDay,
        showOnlySeenLive, showOnlyNotHaveSeenLive,
        showOnlyHaveAtHome, showOnlyNotHaveAtHome,
        ratedFilterMode,
        showOnlyCore,
        readyFilterMode]
    );

    const filterAndSort = () => {
        if (!Array.isArray(originalList) || originalList.length === 0) return;

        let newList = originalList;
        newList = searching(newList);
        newList = filtering(newList);
        newList = sorting(newList);
        onSet(newList);
    }

    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }

        return true;
    }

    const searching = (newList) => {
        if (searchString !== "") {
            switch (filterMode) {
                case FilterMode.Name:
                    newList = filterCheckText(newList, "name", searchString);
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
    }

    const filterCheckText = (newList, key, comparableString) => {
        const needle = String(comparableString).toLowerCase();
        return newList.filter(x =>
            x[key] != null && String(x[key]).toLowerCase().includes(needle)
        );
    };

    const filterCheckTrue = (newList, key) => {
        newList = newList.filter(x => x[key] === true);
        return newList;
    }

    const filterCheckFalse = (newList, key) => {
        newList = newList.filter(x => x[key] === false || !x[key]);
        return newList;
    }

    const filterCheckIntMoreThanZero = (newList, key) => {
        newList = newList.filter(x => x[key] !== undefined && x[key] > 0);
        return newList;
    }

    const filterCheckIntZero = (newList, key) => {
        newList = newList.filter(x => x[key] === undefined || x[key] === 0);
        return newList;
    }

    const filtering = (newList) => {

        //have at home
        if (showOnlyHaveAtHome) {
            newList = filterCheckTrue(newList, "haveAtHome");
        }
        //not have at home
        if (showOnlyNotHaveAtHome) {
            newList = filterCheckFalse(newList, "haveAtHome");
        }
        //seen live
        if (showOnlySeenLive) {
            newList = filterCheckTrue(newList, "seenLive");
        }
        //not have seen live
        if (showOnlyNotHaveSeenLive) {
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
    }

    const sortByText = (newList, key) => {
        newList = [...newList].sort((a, b) => {
            return a[key].toLowerCase() > b[key].toLowerCase() ? 1 : -1
        });
        return newList;
    }

    const sortByDate = (newList, key) => {
        newList = [...newList].sort(
            (a, b) => new Date(a[key]).setHours(0, 0, 0, 0) - new Date(b[key]).setHours(0, 0, 0, 0)
        );
        return newList;
    }

    const sortByInt = (newList, key) => {
        newList = [...newList].sort((a, b) => {
            let aCount = a[key] === undefined ? 0 : a[key];
            let bCount = b[key] === undefined ? 0 : b[key];
            return aCount - bCount;
        });
        return newList;
    }

    const sorting = (newList) => {

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
    }

    return (
        <>
            <Collapse in={showAll} dimension="height">
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
                            <FilterCheckBox
                                onSet={setShowOnlySeenLive}
                                labelText='show_only_seen_live'
                                id='seenlive'
                            />
                        }
                        {
                            showFilterNotHaveSeenLive &&
                            <FilterCheckBox
                                onSet={setShowOnlyNotHaveSeenLive}
                                labelText='show_only_not_have_seen_live'
                                id='notseenlive'
                            />
                        }
                        {
                            showFilterHaveAtHome &&
                            <FilterCheckBox
                                onSet={setShowOnlyHaveAtHome}
                                labelText='show_only_have_at_home'
                                id='haveathome'
                            />
                        }
                        {
                            showFilterNotHaveAtHome &&
                            <FilterCheckBox
                                onSet={setShowOnlyNotHaveAtHome}
                                labelText='show_only_not_have_at_home'
                                id='nothaveathome'
                            />
                        }
                        {
                            showFilterHaveRated &&
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column xs={3} sm={2}>{t('rated')}</Form.Label>
                                <Col xs={9} sm={10}>
                                    <Form.Select
                                        value={ratedFilterMode}
                                        onChange={(event) => setRatedFilterMode(event.target.value)}
                                        id="ratedStatusFilter"
                                    >
                                        <option value={RatedFilterMode.All}>{t('rated_filter_all')}</option>
                                        <option value={RatedFilterMode.Rated}>{t('rated_filter_rated')}</option>
                                        <option value={RatedFilterMode.NotRated}>{t('rated_filter_not_rated')}</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
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
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column xs={3} sm={2}>{t('ready')}</Form.Label>
                                <Col xs={9} sm={10}>
                                    <Form.Select
                                        value={readyFilterMode}
                                        onChange={(event) => setReadyFilterMode(event.target.value)}
                                        id="readyStatusFilter"
                                    >
                                        <option value={ReadyFilterMode.All}>{t('ready_filter_all')}</option>
                                        <option value={ReadyFilterMode.Ready}>{t('ready_filter_ready')}</option>
                                        <option value={ReadyFilterMode.NotReady}>{t('ready_filter_not_ready')}</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        }
                    </Form>
                </div>
            </Collapse>
            <Button text={showAll ? t('hide_search') : t('show_search')} onClick={() => toggleShowAll()} />
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
    showFilterNotHaveSeenLive: false,
    showFilterHaveAtHome: false,
    showFilterNotHaveAtHome: false,
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
    showFilterNotHaveSeenLive: PropTypes.bool,
    showFilterHaveAtHome: PropTypes.bool,
    showFilterNotHaveAtHome: PropTypes.bool,
    showFilterHaveRated: PropTypes.bool,
    showFilterCore: PropTypes.bool,
    showFilterReady: PropTypes.bool,
    //other
    onSet: PropTypes.func
}