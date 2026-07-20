
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';

import { COLORS, ICONS, VARIANTS, TRANSLATION, LIST_VIEW } from '../../utils/Constants';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

import CenterWrapper from './CenterWrapper';
import PageContentWrapper from './PageContentWrapper';
import PageTitle from './PageTitle';
import CopyToClipboardButton from '../Buttons/CopyToClipboardButton';

export default function ManagePage({
    //loading
    loading,
    loadingText,
    title,
    //icon
    iconName,
    iconColor,
    //buttons and actions
    addButton,
    topActions,
    showGoBackButton = true,
    copyButton,
    centerActions,
    //alert
    alert,
    //modal
    modal,
    //filtering, sorting, searching
    searchSortFilter,
    listViewToggle,
    //other
    hasItems,
    emptyText,
    children,
}) {

    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const {
        onSet: onSetSearchSortFilter,
        originalList: originalSearchSortFilterList,
        ...searchSortFilterOptions
    } = searchSortFilter ?? {};
    const showSearchSortFilter =
        originalSearchSortFilterList != null &&
        originalSearchSortFilterList.length > 0;
    const isListViewToggleEnabled = listViewToggle?.enabled ?? false;
    const listViewStorageKey = listViewToggle?.storageKey;
    const defaultListView = listViewToggle?.defaultView === LIST_VIEW.TABLE ? LIST_VIEW.TABLE : LIST_VIEW.CARD;
    const [listView, setListView] = useState(() => {
        if (!listViewStorageKey) {
            return defaultListView;
        }

        try {
            const savedListView = window.localStorage.getItem(listViewStorageKey);
            return savedListView === LIST_VIEW.TABLE ? LIST_VIEW.TABLE : defaultListView;
        } catch {
            return defaultListView;
        }
    });

    useEffect(() => {
        if (!listViewStorageKey) {
            setListView(defaultListView);
            return;
        }

        try {
            const savedListView = window.localStorage.getItem(listViewStorageKey);
            setListView(savedListView === LIST_VIEW.TABLE ? LIST_VIEW.TABLE : defaultListView);
        } catch {
            setListView(defaultListView);
        }
    }, [listViewStorageKey, defaultListView]);

    useEffect(() => {
        if (!listViewStorageKey) {
            return;
        }

        try {
            window.localStorage.setItem(listViewStorageKey, listView);
        } catch {
            // Intentionally ignored: localStorage can be unavailable in some environments.
        }
    }, [listViewStorageKey, listView]);

    if (loading) {
        return <h3>{loadingText}</h3>;
    }

    return (
        <PageContentWrapper>
            <PageTitle title={title} iconName={iconName} iconColor={iconColor} />

            <Row>
                <ButtonGroup>
                    {showGoBackButton ? (<GoBackButton />) : (<></>)}
                    {topActions}
                </ButtonGroup>
            </Row>

            {alert ? (
                <Alert
                    message={alert.message}
                    showMessage={alert.showMessage}
                    error={alert.error}
                    showError={alert.showError}
                    variant={alert.variant ?? VARIANTS.SUCCESS}
                    onClose={alert.onClose}
                />
            ) : (<></>)}

            {modal ? (
                <Modal show={modal.show} onHide={modal.onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modal.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modal.body}
                    </Modal.Body>
                </Modal>
            ) : (<></>)}

            {showSearchSortFilter ? (
                <SearchSortFilter
                    onSet={onSetSearchSortFilter}
                    originalList={originalSearchSortFilterList}
                    {...searchSortFilterOptions}
                />
            ) : (<></>)}

            {isListViewToggleEnabled && hasItems ? (
                <div className='manageListViewSwitch'>
                    <button
                        type='button'
                        className={`btn btn-sm ${listView === LIST_VIEW.CARD ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setListView(LIST_VIEW.CARD)}
                    >
                        {tCommon('buttons.button_view_cards')}
                    </button>
                    <button
                        type='button'
                        className={`btn btn-sm ${listView === LIST_VIEW.TABLE ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setListView(LIST_VIEW.TABLE)}
                    >
                        {tCommon('buttons.button_view_table')}
                    </button>
                </div>
            ) : null}

            {centerActions || addButton ? (
                <CenterWrapper>
                    {centerActions}
                    {copyButton && copyButton.show ? (
                        <CopyToClipboardButton
                            items={copyButton.items}
                            getText={copyButton.getItemText}
                        />
                    ) : null}
                    {addButton ? (
                        <Button
                            iconName={addButton.iconName ?? ICONS.PLUS}
                            secondIconName={addButton.secondIconName}
                            color={addButton.show ? (addButton.openColor ?? COLORS.ADDBUTTON_OPEN) : (addButton.closedColor ?? COLORS.ADDBUTTON_CLOSED)}
                            text={
                                addButton.show ? tCommon('buttons.button_close') : (tCommon('buttons.button_open'))
                            }
                            onClick={addButton.onToggle}
                        />
                    ) : null}
                </CenterWrapper>
            ) : (<></>)}

            {hasItems ? (
                <div className={`manageListView ${listView === LIST_VIEW.TABLE ? 'manageListView-compact' : 'manageListView-card'}`}>
                    {isListViewToggleEnabled && listView === LIST_VIEW.TABLE ? (
                        <div className='manageListTableHeader'>
                            <span>{tCommon('table.item')}</span>
                            <span>{tCommon('table.stars')}</span>
                            <span>{tCommon('table.details')}</span>
                            <span>{tCommon('table.actions')}</span>
                        </div>
                    ) : null}
                    {children}
                </div>
            ) : (
                <CenterWrapper>
                    {emptyText}
                </CenterWrapper>
            )}
        </PageContentWrapper>
    );
}

ManagePage.propTypes = {
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    title: PropTypes.node,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    addButton: PropTypes.shape({
        show: PropTypes.bool,
        onToggle: PropTypes.func,
        text: PropTypes.string,
        openColor: PropTypes.string,
        closedColor: PropTypes.string,
        iconName: PropTypes.string,
        secondIconName: PropTypes.string,
    }),
    topActions: PropTypes.node,
    showGoBackButton: PropTypes.bool,
    centerActions: PropTypes.node,
    alert: PropTypes.shape({
        message: PropTypes.string,
        showMessage: PropTypes.bool,
        error: PropTypes.string,
        showError: PropTypes.bool,
        variant: PropTypes.string,
        onClose: PropTypes.func,
    }),
    modal: PropTypes.shape({
        show: PropTypes.bool,
        onHide: PropTypes.func,
        title: PropTypes.node,
        body: PropTypes.node,
    }),
    searchSortFilter: PropTypes.object,
    listViewToggle: PropTypes.shape({
        enabled: PropTypes.bool,
        defaultView: PropTypes.oneOf([LIST_VIEW.CARD, LIST_VIEW.TABLE]),
        storageKey: PropTypes.string,
    }),
    hasItems: PropTypes.bool,
    emptyText: PropTypes.node,
    children: PropTypes.node,
    copyButton: PropTypes.shape({
        items: PropTypes.array,
        getItemText: PropTypes.func,
    }),
};
