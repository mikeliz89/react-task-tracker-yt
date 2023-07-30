import { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import { SortMode } from './SortModes';
import { FilterMode } from './FilterModes';
import PropTypes from 'prop-types';
import * as Constants from '../../utils/Constants';

const SearchSortFilter = ({ onSet,
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
    showSearchByDescription,
    showSearchByDay,
    showSearchByIncredients,
    //filtering
    showFilterSeenLive,
    showFilterNotHaveSeenLive,
    showFilterHaveAtHome,
    showFilterNotHaveAtHome,
    showFilterHaveRated,
    showFilterNotHaveRated,
    showFilterCore,
    showFilterReady,
    showFilterNotReady,
    //filtermode
    filterMode
}) => {

    //states
    const [searchString, setSearchString] = useState('');
    const [searchStringDescription, setSearchStringDescription] = useState('');
    const [searchStringDay, setSearchStringDay] = useState('');
    const [searchStringIncredients, setSearchStringIncredients] = useState('');
    const [sortBy, setSortBy] = useState(defaultSort);
    const [showOnlySeenLive, setShowOnlySeenLive] = useState(false);
    const [showOnlyNotHaveSeenLive, setShowOnlyNotHaveSeenLive] = useState(false);
    const [showOnlyHaveAtHome, setShowOnlyHaveAtHome] = useState(false);
    const [showOnlyNotHaveAtHome, setShowOnlyNotHaveAtHome] = useState(false);
    const [showOnlyHaveRated, setShowOnlyHaveRated] = useState(false);
    const [showOnlyNotHaveRated, setShowOnlyNotHaveRated] = useState(false);
    const [showOnlyCore, setShowOnlyCore] = useState(false);
    const [showOnlyReady, setShowOnlyReady] = useState(false);
    const [showOnlyNotReady, setShowOnlyNotReady] = useState(false);

    //sorting
    const [_showSortByName, _setShowSortByName] = useState(showSortByName);
    const [_showSortByTitle, _setShowSortByTitle] = useState(showSortByTitle);
    const [_showSortByCreatedDate, _setShowSortByCreatedDate] = useState(showSortByCreatedDate);
    const [_showSortByText, _setShowSortByText] = useState(showSortByText);
    const [_showSortByStarRating, _setShowSortByStarRating] = useState(showSortByStarRating);
    const [_showSortByBirthday, _setShowSortByBirthday] = useState(showSortByBirthday);
    const [_showSortByPublishYear, _setShowSortByPublishYear] = useState(showSortByPublishYear);

    //filtering
    const [_showOnlySeenLive, _setShowOnlySeenLive] = useState(showFilterSeenLive);
    const [_showOnlyNotHaveSeenLive, _setShowOnlyNotHaveSeenLive] = useState(showFilterNotHaveSeenLive);
    const [_showOnlyHaveAtHome, _setShowOnlyHaveAtHome] = useState(showFilterHaveAtHome);
    const [_showOnlyNotHaveAtHome, _setShowOnlyNotHaveAtHome] = useState(showFilterNotHaveAtHome);
    const [_showOnlyHaveRated, _setShowOnlyHaveRated] = useState(showFilterHaveRated);
    const [_showOnlyNotHaveRated, _setShowOnlyNotHaveRated] = useState(showFilterNotHaveRated);
    const [_showOnlyReady, _setShowOnlyReady] = useState(showFilterReady);
    const [_showOnlyNotReady, _setShowOnlyNotReady] = useState(showFilterNotReady);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_SEARCHSORTFILTER, { keyPrefix: Constants.TRANSLATION_SEARCHSORTFILTER });

    //componentDidMount
    useEffect(() => {
        filterAndSort();
    }, []);

    useEffect(() => {
        filterAndSort();
    }, [sortBy,
        searchString, searchStringDescription,
        searchStringIncredients, searchStringDay,
        showOnlySeenLive, showOnlyNotHaveSeenLive,
        showOnlyHaveAtHome, showOnlyNotHaveAtHome,
        showOnlyHaveRated, showOnlyNotHaveRated,
        showOnlyCore,
        showOnlyReady, showOnlyNotReady]);

    const filterAndSort = () => {
        if (!originalList) {
            return;
        }
        let newList = originalList;
        newList = searching(newList);
        newList = filtering(newList);
        newList = sorting(newList);
        onSet(newList);
    }

    const searching = (newList) => {
        if (searchString !== "") {
            switch (filterMode) {
                case FilterMode.Name:
                    newList = newList.filter(x => x.name != null && x.name.toLowerCase().includes(searchString.toLowerCase()));
                    break;
                case FilterMode.Text:
                    newList = newList.filter(x => x.text != null && x.text.toLowerCase().includes(searchString.toLowerCase()));
                    break;
                case FilterMode.Title:
                    newList = newList.filter(x => x.title != null && x.title.toLowerCase().includes(searchString.toLowerCase()));
                    break;
            }
        }
        if (searchStringIncredients !== "") {
            newList = newList.filter(x => x.incredients != null && x.incredients.toLowerCase().includes(searchStringIncredients.toLowerCase()));
        }
        if (searchStringDescription !== "") {
            newList = newList.filter(x => x.description != null && x.description.toLowerCase().includes(searchStringDescription.toLowerCase()));
        }
        if (searchStringDay !== "") {
            newList = newList.filter(x => x.day != null && x.day.toLowerCase().includes(searchStringDay.toLowerCase()));
        }
        return newList;
    }

    const filtering = (newList) => {

        //have at home
        if (showOnlyHaveAtHome) {
            newList = newList.filter(x => x.haveAtHome === true);
        }
        //not have at home
        else if (showOnlyNotHaveAtHome) {
            newList = newList.filter(x => x.haveAtHome === false || !x.haveAtHome);
        }

        //seen live
        if (showOnlySeenLive) {
            newList = newList.filter(x => x.seenLive === true);
        }
        //not have seen live
        else if (showOnlyNotHaveSeenLive) {
            newList = newList.filter(x => x.seenLive === false || !x.seenLive);
        }

        //rated
        if (showOnlyHaveRated) {
            newList = newList.filter(x => x.stars !== undefined && x.stars > 0);
        }
        //not rated
        else if (showOnlyNotHaveRated) {
            newList = newList.filter(x => x.stars === undefined || x.stars === 0);
        }

        //core
        if (showOnlyCore) {
            newList = newList.filter(x => x.isCore === true);
        }

        //ready
        if (showOnlyReady) {
            newList = newList.filter(x => x.reminder === true);
        }
        //notready
        else if (showOnlyNotReady) {
            newList = newList.filter(x => x.reminder === false);
        }

        return newList;
    }

    const sorting = (newList) => {

        //sortit
        switch (sortBy) {
            case SortMode.Name_ASC:
            case SortMode.Name_DESC:
                newList = [...newList].sort((a, b) => {
                    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                });
                if (sortBy === SortMode.Name_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Title_ASC:
            case SortMode.Title_DESC:
                newList = [...newList].sort((a, b) => {
                    return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
                });
                if (sortBy === SortMode.Title_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Created_ASC:
            case SortMode.Created_DESC:
                newList = [...newList].sort(
                    (a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0)
                );
                if (sortBy === SortMode.Created_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Text_ASC:
            case SortMode.Text_DESC:
                newList = [...newList].sort((a, b) => {
                    return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1
                });
                if (sortBy === SortMode.Text_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.StarRating_ASC:
            case SortMode.StarRating_DESC:
                newList = [...newList].sort((a, b) => {
                    let aStars = a.stars === undefined ? 0 : a.stars;
                    let bStars = b.stars === undefined ? 0 : b.stars;
                    return aStars - bStars
                });
                if (sortBy === SortMode.StarRating_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.PublishYear_ASC:
            case SortMode.PublishYear_DESC:
                newList = [...newList].sort((a, b) => {
                    let aYear = a.publishYear === undefined ? 0 : a.publishYear;
                    let bYear = b.publishYear === undefined ? 0 : b.publishYear;
                    return aYear - bYear
                });
                if (sortBy === SortMode.PublishYear_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Birthday_ASC:
            case SortMode.Birthday_DESC:
                newList = [...newList].sort(
                    (a, b) => new Date(a.birthday).setHours(0, 0, 0, 0) - new Date(b.birthday).setHours(0, 0, 0, 0)
                );
                if (sortBy === SortMode.Birthday_DESC) {
                    newList.reverse();
                }
                break;
        }
        return newList;
    }

    return (
        <div className="searchSortFilter">
            <Form className='form-no-paddings'>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                    <Col xs={9} sm={10}>
                        {
                            _showSortByCreatedDate &&
                            <>
                                <Button
                                    iconName={sortBy === SortMode.Created_DESC ? 'arrow-down' : sortBy === SortMode.Created_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
                                    }}
                                    text={t('created_date')} type="button" />
                            </>
                        }
                        {
                            _showSortByName &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Name_DESC ? 'arrow-down' : sortBy === SortMode.Name_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
                                    }}
                                    text={t('name')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByTitle &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Title_DESC ? 'arrow-down' : sortBy === SortMode.Title_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Title_ASC ? setSortBy(SortMode.Title_DESC) : setSortBy(SortMode.Title_ASC);
                                    }}
                                    text={t('title')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByText &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Text_DESC ? 'arrow-down' : sortBy === SortMode.Text_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Text_ASC ? setSortBy(SortMode.Text_DESC) : setSortBy(SortMode.Text_ASC);
                                    }}
                                    text={t('text')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByStarRating &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.StarRating_DESC ? 'arrow-down' : sortBy === SortMode.StarRating_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.StarRating_ASC ? setSortBy(SortMode.StarRating_DESC) : setSortBy(SortMode.StarRating_ASC);
                                    }}
                                    text={t('star_rating')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByBirthday &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Birthday_DESC ? 'arrow-down' : sortBy === SortMode.Birthday_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Birthday_ASC ? setSortBy(SortMode.Birthday_DESC) : setSortBy(SortMode.Birthday_ASC);
                                    }}
                                    text={t('birthday')} type="button" />
                            </>
                        }
                        {
                            _showSortByPublishYear &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.PublishYear_DESC ? 'arrow-down' : sortBy === SortMode.PublishYear_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.PublishYear_ASC ? setSortBy(SortMode.PublishYear_DESC) : setSortBy(SortMode.PublishYear_ASC);
                                    }}
                                    text={t('publishYear')} type="button" />
                            </>
                        }
                    </Col>
                </Form.Group>
                {
                    showSearchByText &&
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    autoComplete='off'
                                    type="text"
                                    id="inputSearchString"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchString(e.target.value)}
                                    placeholder={t('placeholder_name')}
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showSearchByDescription &&
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    autoComplete='off'
                                    type="text"
                                    id="inputSearchStringDescription"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchStringDescription(e.target.value)}
                                    placeholder={t('placeholder_description')}
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showSearchByDay &&
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    autoComplete='off'
                                    type="text"
                                    id="inputSearchStringDay"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchStringDay(e.target.value)}
                                    placeholder={t('placeholder_day')}
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showSearchByIncredients &&
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    autoComplete='off'
                                    type="text"
                                    id="inputSearchStringIncredients"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchStringIncredients(e.target.value)}
                                    placeholder={t('placeholder_incredients')}
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterSeenLive &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlySeenLive'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_seen_live')}
                                    onChange={(e) => {
                                        setShowOnlySeenLive(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotHaveSeenLive &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotHaveSeenLive'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_have_seen_live')}
                                    onChange={(e) => {
                                        setShowOnlyNotHaveSeenLive(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterHaveAtHome &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyHaveAtHome'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_have_at_home')}
                                    onChange={(e) => {
                                        setShowOnlyHaveAtHome(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotHaveAtHome &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotHaveAtHome'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_have_at_home')}
                                    onChange={(e) => {
                                        setShowOnlyNotHaveAtHome(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterHaveRated &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyHaveRated'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_have_rated')}
                                    onChange={(e) => {
                                        setShowOnlyHaveRated(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotHaveRated &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotHaveRated'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_have_rated')}
                                    onChange={(e) => {
                                        setShowOnlyNotHaveRated(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterCore &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyCore'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_core')}
                                    onChange={(e) => {
                                        setShowOnlyCore(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterReady &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyReady'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_ready')}
                                    onChange={(e) => {
                                        setShowOnlyReady(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotReady &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotReady'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_ready')}
                                    onChange={(e) => {
                                        setShowOnlyNotReady(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
            </Form>
        </div>
    )
}

SearchSortFilter.defaultProps = {
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
    showFilterNotHaveRated: false,
    showFilterCore: false,
    showfilterReady: false,
    showFilterNotReady: false
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
    showFilterNotHaveRated: PropTypes.bool,
    showFilterCore: PropTypes.bool,
    showFilterReady: PropTypes.bool,
    showFilterNotReady: PropTypes.bool,
    //other
    onSet: PropTypes.func
}

export default SearchSortFilter
