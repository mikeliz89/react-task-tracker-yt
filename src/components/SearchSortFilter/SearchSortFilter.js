//react
import { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
import { SortMode } from './SortModes';
//proptypes
import PropTypes from 'prop-types';

const SearchSortFilter = ({ onSet,
    originalList,
    showSortByName,
    showSortByTitle,
    showSortByCreatedDate,
    showSearch,
    defaultSort }) => {

    //states
    const [searchString, setSearchString] = useState('');
    const [sortBy, setSortBy] = useState(defaultSort);
    const [_showSortByName, _setShowSortByName] = useState(showSortByName);
    const [_showSortByTitle, _setShowSortByTitle] = useState(showSortByTitle);
    const [_showSortByCreatedDate, _setShowSortByCreatedDate] = useState(showSortByCreatedDate);

    //translation
    const { t } = useTranslation('searchsortfilter', { keyPrefix: 'searchsortfilter' });

    //componentDidMount
    useEffect(() => {
        filterAndSort(searchString, sortBy)
    }, [])

    useEffect(() => {
        filterAndSort(searchString, sortBy);
    }, [sortBy, searchString]);

    const filterAndSort = (searchString, sortBy) => {
        if (!originalList) {
            return;
        }
        let newList = originalList;
        //haut
        if (searchString !== "") {
            newList = newList.filter(x => x.name.toLowerCase().includes(searchString.toLowerCase()));
        }
        //filtterit: TODO
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
        onSet(newList);
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
                                    sortBy === SortMode.Created_DESC ? <FaArrowDown /> : ''
                                }
                                {
                                    sortBy === SortMode.Created_ASC ? <FaArrowUp /> : ''
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
                                    sortBy === SortMode.Name_DESC ? <FaArrowDown /> : ''
                                }
                                {
                                    sortBy === SortMode.Name_ASC ? <FaArrowUp /> : ''
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
                                    sortBy === SortMode.Name_DESC ? <FaArrowDown /> : ''
                                }
                                {
                                    sortBy === SortMode.Title_ASC ? <FaArrowUp /> : ''
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
                                    type="text"
                                    id="inputSearchString"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchString(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
            </Form>
        </div>
    )
}

SearchSortFilter.defaultProps = {
    defaultSort: SortMode.Created_ASC,
    showSearch: true
}

SearchSortFilter.propTypes = {
    defaultSort: PropTypes.string,
    showSortByName: PropTypes.bool,
    showSortByTitle: PropTypes.bool,
    showSortByCreatedDate: PropTypes.bool,
    showSearch: PropTypes.bool,
    onSet: PropTypes.func
}

export default SearchSortFilter
