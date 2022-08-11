//react
import { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
import { SortMode } from './SortModes';
//proptypes
import PropTypes from 'prop-types';
import Icon from '../Icon';

const SearchSortFilter = ({ onSet,
    originalList,
    showSortByName,
    showSortByTitle,
    showSortByCreatedDate,
    showSearch,
    showFilterHaveAtHome,
    showFilterNotHaveAtHome,
    showFilterHaveRated,
    showFilterNotHaveRated,
    showFilterCore,
    useNameFiltering,
    useTitleFiltering,
    defaultSort }) => {

    //states
    const [searchString, setSearchString] = useState('');
    const [sortBy, setSortBy] = useState(defaultSort);
    const [showOnlyHaveAtHome, setShowOnlyHaveAtHome] = useState(false);
    const [showOnlyNotHaveAtHome, setShowOnlyNotHaveAtHome] = useState(false);
    const [showOnlyHaveRated, setShowOnlyHaveRated] = useState(false);
    const [showOnlyNotHaveRated, setShowOnlyNotHaveRated] = useState(false);
    const [showOnlyCore, setShowOnlyCore] = useState(false);

    //private states
    const [_showSortByName, _setShowSortByName] = useState(showSortByName);
    const [_showSortByTitle, _setShowSortByTitle] = useState(showSortByTitle);
    const [_showSortByCreatedDate, _setShowSortByCreatedDate] = useState(showSortByCreatedDate);
    const [_showOnlyHaveAtHome, _setShowOnlyHaveAtHome] = useState(showFilterHaveAtHome);
    const [_showOnlyNotHaveAtHome, _setShowOnlyNotHaveAtHome] = useState(showFilterNotHaveAtHome);
    const [_showOnlyHaveRated, _setShowOnlyHaveRated] = useState(showFilterHaveRated);
    const [_showOnlyNotHaveRated, _setShowOnlyNotHaveRated] = useState(showFilterNotHaveRated);
    const [_showOnlyCore, _setShowOnlyCore] = useState(showFilterCore);

    //translation
    const { t } = useTranslation('searchsortfilter', { keyPrefix: 'searchsortfilter' });

    //componentDidMount
    useEffect(() => {
        filterAndSort(searchString, sortBy)
    }, [])

    useEffect(() => {
        filterAndSort();
    }, [sortBy, searchString, showOnlyHaveAtHome, showOnlyNotHaveAtHome, showOnlyHaveRated, showOnlyNotHaveRated,
        showOnlyCore]);

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
            if (useNameFiltering) {
                newList = newList.filter(x => x.name != null && x.name.toLowerCase().includes(searchString.toLowerCase()));
            }
            if (useTitleFiltering) {
                newList = newList.filter(x => x.title != null && x.title.toLowerCase().includes(searchString.toLowerCase()));
            }
        }
        return newList;
    }

    const filtering = (newList) => {
        //have at home
        if (showOnlyHaveAtHome) {
            newList = newList.filter(x => x.haveAtHome === true);
        }
        else if (showOnlyNotHaveAtHome) {
            newList = newList.filter(x => x.haveAtHome === false || !x.haveAtHome);
        }
        //rated
        if (showOnlyHaveRated) {
            newList = newList.filter(x => x.stars !== undefined && x.stars > 0);
        }
        else if (showOnlyNotHaveRated) {
            newList = newList.filter(x => x.stars === undefined || x.stars === 0);
        }
        if(showOnlyCore) {
            newList = newList.filter(x => x.isCore === true);
        }
        return newList;
    }

    const sorting = (newList) => {
        //sortit
        if (sortBy === SortMode.Name_ASC || sortBy === SortMode.Name_DESC) {
            newList = [...newList].sort((a, b) => {
                return a.name > b.name ? 1 : -1
            });
            if (sortBy === SortMode.Name_DESC) {
                newList.reverse();
            }
        } else if (sortBy === SortMode.Title_ASC || sortBy === SortMode.Title_DESC) {
            newList = [...newList].sort((a, b) => {
                return a.title > b.title ? 1 : -1
            });
            if (sortBy === SortMode.Title_DESC) {
                newList.reverse();
            }
        } else if (sortBy === SortMode.Created_ASC || sortBy === SortMode.Created_DESC) {
            newList = [...newList].sort(
                (a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0)
            );
            if (sortBy === SortMode.Created_DESC) {
                newList.reverse();
            }
        }
        return newList;
    }

    return (
        <div>
            <Form className='form-no-paddings'>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                    <Col xs={9} sm={10}>
                        {
                            _showSortByCreatedDate &&
                            <>
                                <Button onClick={() => {
                                    sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
                                }} text={t('created_date')} type="button" />
                                {
                                    sortBy === SortMode.Created_DESC ? <Icon name='arrow-down' /> : ''
                                }
                                {
                                    sortBy === SortMode.Created_ASC ? <Icon name='arrow-up' /> : ''
                                }
                            </>
                        }
                        {
                            _showSortByName &&
                            <>
                                &nbsp;
                                <Button onClick={() => {
                                    sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
                                }
                                }
                                    text={t('name')} type="button"
                                />
                                {
                                    sortBy === SortMode.Name_DESC ? <Icon name='arrow-down' /> : ''
                                }
                                {
                                    sortBy === SortMode.Name_ASC ? <Icon name='arrow-up' /> : ''
                                }
                            </>
                        }
                        {
                            _showSortByTitle &&
                            <>
                                &nbsp;
                                <Button onClick={() => {
                                    sortBy === SortMode.Title_ASC ? setSortBy(SortMode.Title_DESC) : setSortBy(SortMode.Title_ASC);
                                }
                                }
                                    text={t('title')} type="button"
                                />
                                {
                                    sortBy === SortMode.Title_DESC ? <Icon name='arrow-down' /> : ''
                                }
                                {
                                    sortBy === SortMode.Title_ASC ? <Icon name='arrow-up' /> : ''
                                }
                            </>
                        }
                    </Col>
                </Form.Group>
                {
                    showSearch &&
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
                                />
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
            </Form>
        </div>
    )
}

SearchSortFilter.defaultProps = {
    //sorting
    defaultSort: SortMode.Created_ASC,
    //searching
    showSearch: true,
    //filtering
    showFilterHaveAtHome: false,
    showFilterNotHaveAtHome: false,
    showFilterHaveRated: false,
    showFilterNotHaveRated: false,
    showFilterCore: false,
    useNameFiltering: false,
    useTitleFiltering: false
}

SearchSortFilter.propTypes = {
    //sorting
    defaultSort: PropTypes.string,
    showSortByName: PropTypes.bool,
    showSortByTitle: PropTypes.bool,
    showSortByCreatedDate: PropTypes.bool,
    //searching
    showSearch: PropTypes.bool,
    //filtering
    showFilterHaveAtHome: PropTypes.bool,
    showFilterNotHaveAtHome: PropTypes.bool,
    showFilterHaveRated: PropTypes.bool,
    showFilterNotHaveRated: PropTypes.bool,
    showFilterCore: PropTypes.bool,
    useNameFiltering: PropTypes.bool,
    useTitleFiltering: PropTypes.bool,
    //other
    onSet: PropTypes.func
}

export default SearchSortFilter
