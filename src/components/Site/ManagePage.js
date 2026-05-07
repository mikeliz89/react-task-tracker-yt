
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';

import { COLORS, ICONS, VARIANTS, TRANSLATION } from '../../utils/Constants';
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
                children
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
    hasItems: PropTypes.bool,
    emptyText: PropTypes.node,
    children: PropTypes.node,
    copyButton: PropTypes.shape({
        items: PropTypes.array,
        getItemText: PropTypes.func,
    }),
};
