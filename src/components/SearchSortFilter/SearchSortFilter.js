import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';
import { useToggle } from '../Hooks/useToggle';

import FilterCheckBox from './FilterCheckBox';
import FilterDropDown from './FilterDropDown';
import { FilterMode } from './FilterModes';
import { HomeFilterMode, RatedFilterMode, ReadyFilterMode, SeenLiveFilterMode } from './FilterStatusModes';
import SearchTextInput from './SearchTextInput';
import SortByButton from './SortByButton';
import {
    filterCheckAnyText,
    filterCheckFalse,
    filterCheckIntMoreThanZero,
    filterCheckIntZero,
    filterCheckText,
    filterCheckTrue,
    sortByDate,
    sortByInt,
    sortByText,
} from './SearchSortFilterUtils';
import { SortMode } from './SortModes';

const SORTING_GROUPS = [
    { asc: SortMode.Name_ASC, desc: SortMode.Name_DESC, key: 'name', sorter: sortByText },
    { asc: SortMode.TrackName_ASC, desc: SortMode.TrackName_DESC, key: 'trackName', sorter: sortByText },
    { asc: SortMode.Title_ASC, desc: SortMode.Title_DESC, key: 'title', sorter: sortByText },
    { asc: SortMode.Created_ASC, desc: SortMode.Created_DESC, key: 'created', sorter: sortByDate },
    { asc: SortMode.FuelingDate_ASC, desc: SortMode.FuelingDate_DESC, key: 'fuelingDate', sorter: sortByDate },
    { asc: SortMode.Text_ASC, desc: SortMode.Text_DESC, key: 'text', sorter: sortByText },
    { asc: SortMode.StarRating_ASC, desc: SortMode.StarRating_DESC, key: 'stars', sorter: sortByInt },
    { asc: SortMode.PublishYear_ASC, desc: SortMode.PublishYear_DESC, key: 'publishYear', sorter: sortByInt },
    { asc: SortMode.Birthday_ASC, desc: SortMode.Birthday_DESC, key: 'birthday', sorter: sortByDate },
];

const PRIMARY_SEARCH_RULES = {
    [FilterMode.Name]: (list, value) => filterCheckText(list, 'name', value),
    [FilterMode.NameOrBand]: (list, value) => filterCheckAnyText(list, ['name', 'band'], value),
    [FilterMode.Text]: (list, value) => filterCheckText(list, 'text', value),
    [FilterMode.Title]: (list, value) => filterCheckText(list, 'title', value),
};

export default function SearchSortFilter({ onSet,
    originalList,
    //sorting
    defaultSort,
    showSortByName,
    showSortByTitle,
    showSortByCreatedDate,
    showSortByFuelingDate,
    showSortByText,
    showSortByStarRating,
    showSortByBirthday,
    showSortByPublishYear,
    showSortByTrackName,
    showSortButtons,
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

    const searchInputControls = [
        {
            enabled: showSearchByText,
            setSearchString,
            placeholderText: 'placeholder_name',
            inputId: 'searchSortFilter-name'
        },
        {
            enabled: showSearchByFinnishName,
            setSearchString: setSearchStringFinnishName,
            placeholderText: 'placeholder_finnishname',
            inputId: 'searchSortFilter-finnishName'
        },
        {
            enabled: showSearchByDescription,
            setSearchString: setSearchStringDescription,
            placeholderText: 'placeholder_description',
            inputId: 'searchSortFilter-description'
        },
        {
            enabled: showSearchByDay,
            setSearchString: setSearchStringDay,
            placeholderText: 'placeholder_day',
            inputId: 'searchSortFilter-day'
        },
        {
            enabled: showSearchByIncredients,
            setSearchString: setSearchStringIncredients,
            placeholderText: 'placeholder_incredients',
            inputId: 'searchSortFilter-incredients'
        }
    ];

    const filterDropDownControls = [
        {
            enabled: showFilterSeenLive,
            id: 'seenLiveStatusFilter',
            labelText: 'show_only_seen_live',
            value: seenLiveFilterMode,
            onSet: setSeenLiveFilterMode,
            options: [
                { value: SeenLiveFilterMode.All, labelText: 'seen_live_filter_all' },
                { value: SeenLiveFilterMode.Seen, labelText: 'seen_live_filter_seen' },
                { value: SeenLiveFilterMode.NotSeen, labelText: 'seen_live_filter_not_seen' },
            ]
        },
        {
            enabled: showFilterHaveAtHome,
            id: 'haveAtHomeStatusFilter',
            labelText: 'home_filter_have',
            value: homeFilterMode,
            onSet: setHomeFilterMode,
            options: [
                { value: HomeFilterMode.All, labelText: 'home_filter_all' },
                { value: HomeFilterMode.Have, labelText: 'home_filter_have' },
                { value: HomeFilterMode.NotHave, labelText: 'home_filter_not_have' },
            ]
        },
        {
            enabled: showFilterHaveRated,
            id: 'ratedStatusFilter',
            labelText: 'rated',
            value: ratedFilterMode,
            onSet: setRatedFilterMode,
            options: [
                { value: RatedFilterMode.All, labelText: 'rated_filter_all' },
                { value: RatedFilterMode.Rated, labelText: 'rated_filter_rated' },
                { value: RatedFilterMode.NotRated, labelText: 'rated_filter_not_rated' },
            ]
        },
        {
            enabled: showFilterReady,
            id: 'readyStatusFilter',
            labelText: 'ready',
            value: readyFilterMode,
            onSet: setReadyFilterMode,
            options: [
                { value: ReadyFilterMode.All, labelText: 'ready_filter_all' },
                { value: ReadyFilterMode.Ready, labelText: 'ready_filter_ready' },
                { value: ReadyFilterMode.NotReady, labelText: 'ready_filter_not_ready' },
            ]
        }
    ];

    const sortButtonControls = [
        {
            enabled: showSortByCreatedDate,
            sortModeASC: SortMode.Created_ASC,
            sortModeDESC: SortMode.Created_DESC,
            title: 'created_date'
        },
        {
            enabled: showSortByFuelingDate,
            sortModeASC: SortMode.FuelingDate_ASC,
            sortModeDESC: SortMode.FuelingDate_DESC,
            title: 'fueling_date'
        },
        {
            enabled: showSortByName,
            sortModeASC: SortMode.Name_ASC,
            sortModeDESC: SortMode.Name_DESC,
            title: 'name'
        },
        {
            enabled: showSortByTrackName,
            sortModeASC: SortMode.TrackName_ASC,
            sortModeDESC: SortMode.TrackName_DESC,
            title: 'track_name'
        },
        {
            enabled: showSortByTitle,
            sortModeASC: SortMode.Title_ASC,
            sortModeDESC: SortMode.Title_DESC,
            title: 'title'
        },
        {
            enabled: showSortByText,
            sortModeASC: SortMode.Text_ASC,
            sortModeDESC: SortMode.Text_DESC,
            title: 'text'
        },
        {
            enabled: showSortByStarRating,
            sortModeASC: SortMode.StarRating_ASC,
            sortModeDESC: SortMode.StarRating_DESC,
            title: 'star_rating'
        },
        {
            enabled: showSortByBirthday,
            sortModeASC: SortMode.Birthday_ASC,
            sortModeDESC: SortMode.Birthday_DESC,
            title: 'birthday'
        },
        {
            enabled: showSortByPublishYear,
            sortModeASC: SortMode.PublishYear_ASC,
            sortModeDESC: SortMode.PublishYear_DESC,
            title: 'publishYear'
        }
    ];

    const sortSelectOptions = sortButtonControls
        .filter(x => x.enabled)
        .flatMap((control) => ([
            {
                value: control.sortModeASC,
                label: `${t(control.title)} ↑`
            },
            {
                value: control.sortModeDESC,
                label: `${t(control.title)} ↓`
            }
        ]));

    const searching = useCallback((newList) => {
        let filteredList = newList;

        if (searchString !== "") {
            const applyPrimarySearch = PRIMARY_SEARCH_RULES[filterMode];
            if (applyPrimarySearch) {
                filteredList = applyPrimarySearch(filteredList, searchString);
            }
        }

        const extraSearchRules = [
            searchStringFinnishName !== "" && ((list) => filterCheckText(list, "nameFi", searchStringFinnishName)),
            searchStringIncredients !== "" && ((list) => filterCheckText(list, "incredients", searchStringIncredients)),
            searchStringDescription !== "" && ((list) => filterCheckText(list, "description", searchStringDescription)),
            searchStringDay !== "" && ((list) => filterCheckText(list, "day", searchStringDay)),
        ].filter(Boolean);

        return extraSearchRules.reduce((list, applyRule) => applyRule(list), filteredList);
    }, [
        searchString,
        filterMode,
        searchStringFinnishName,
        searchStringIncredients,
        searchStringDescription,
        searchStringDay
    ]);

    const filtering = useCallback((newList) => {
        const rules = [
            homeFilterMode === HomeFilterMode.Have && ((list) => filterCheckTrue(list, "haveAtHome")),
            homeFilterMode === HomeFilterMode.NotHave && ((list) => filterCheckFalse(list, "haveAtHome")),
            seenLiveFilterMode === SeenLiveFilterMode.Seen && ((list) => filterCheckTrue(list, "seenLive")),
            seenLiveFilterMode === SeenLiveFilterMode.NotSeen && ((list) => filterCheckFalse(list, "seenLive")),
            ratedFilterMode === RatedFilterMode.Rated && ((list) => filterCheckIntMoreThanZero(list, "stars")),
            ratedFilterMode === RatedFilterMode.NotRated && ((list) => filterCheckIntZero(list, "stars")),
            showOnlyCore && ((list) => filterCheckTrue(list, "isCore")),
            readyFilterMode === ReadyFilterMode.Ready && ((list) => filterCheckTrue(list, "reminder")),
            readyFilterMode === ReadyFilterMode.NotReady && ((list) => filterCheckFalse(list, "reminder")),
        ].filter(Boolean);

        return rules.reduce((list, applyRule) => applyRule(list), newList);
    }, [homeFilterMode, seenLiveFilterMode, ratedFilterMode, showOnlyCore, readyFilterMode]);

    const sorting = useCallback((newList) => {
        const group = SORTING_GROUPS.find(({ asc, desc }) => sortBy === asc || sortBy === desc);
        if (!group) {
            return newList;
        }

        const sortedList = group.sorter(newList, group.key);
        if (sortBy === group.desc) {
            sortedList.reverse();
        }

        return sortedList;
    }, [sortBy]);

    const filterAndSort = useCallback(() => {
        if (!Array.isArray(originalList) || originalList.length === 0) {
            return;
        }

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
                    <Form className='form-no-paddings searchSortFilter-form'>
                        <Row className='g-2 align-items-end searchSortFilter-toolbar'>
                            {searchInputControls.filter(x => x.enabled).map((control) => (
                                <Col xs={12} md={6} lg={4} xl={3} key={control.inputId}>
                                    <SearchTextInput
                                        setSearchString={control.setSearchString}
                                        placeholderText={control.placeholderText}
                                        inputId={control.inputId}
                                        compact
                                    />
                                </Col>
                            ))}
                            {filterDropDownControls.filter(x => x.enabled).map((control) => (
                                <Col xs={12} md={6} lg={4} xl={3} key={control.id}>
                                    <FilterDropDown
                                        id={control.id}
                                        labelText={control.labelText}
                                        value={control.value}
                                        onSet={control.onSet}
                                        compact
                                        options={control.options}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Form.Group as={Row} className='searchSortFilter-sorting'>
                            <Form.Label column xs={12} md={2} className='mb-1 mb-md-0'>{t('sorting')}</Form.Label>
                            <Col xs={12} md={10}>
                                {showSortButtons ? (
                                    <ButtonGroup className='searchSortFilter-sortButtons'>
                                        {sortButtonControls.filter(x => x.enabled).map((control) => (
                                            <SortByButton
                                                key={control.sortModeASC}
                                                sortBy={sortBy}
                                                sortModeASC={control.sortModeASC}
                                                sortModeDESC={control.sortModeDESC}
                                                onSortBy={setSortBy}
                                                title={control.title}
                                            />
                                        ))}
                                    </ButtonGroup>
                                ) : (
                                    <Form.Select
                                        id='searchSortFilter-sorting'
                                        className='searchSortFilter-control'
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        {sortSelectOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Col>
                        </Form.Group>
                        {
                            showFilterCore &&
                            <FilterCheckBox
                                onSet={setShowOnlyCore}
                                labelText='show_only_core'
                                id='iscore'
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
    showSortByFuelingDate: false,
    showSortByText: false,
    showSortByStarRating: false,
    showSortByBirthday: false,
    showSortByPublishYear: false,
    showSortButtons: false,
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
    showSortByFuelingDate: PropTypes.bool,
    showSortByText: PropTypes.bool,
    showSortByStarRating: PropTypes.bool,
    showSortButtons: PropTypes.bool,
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


