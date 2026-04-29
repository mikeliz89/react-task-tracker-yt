import { Row, ButtonGroup, Modal } from 'react-bootstrap';

import { COLORS, ICONS, VARIANTS } from '../../utils/Constants';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

import CenterWrapper from './CenterWrapper';
import PageContentWrapper from './PageContentWrapper';
import PageTitle from './PageTitle';

export default function ManagePage({
    loading,
    loadingText,
    title,
    iconName,
    iconColor,
    topActions,
    showGoBackButton = true,
    alert,
    modal,
    searchSortFilter,
    centerActions,
    addButton,
    hasItems,
    emptyText,
    children,
}) {
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

            {
                alert ? (
                    <Alert
                        message={alert.message}
                        showMessage={alert.showMessage}
                        error={alert.error}
                        showError={alert.showError}
                        variant={alert.variant ?? VARIANTS.SUCCESS}
                        onClose={alert.onClose}
                    />
                ) : (<></>)
            }

            {
                modal ? (
                    <Modal show={modal.show} onHide={modal.onHide}>
                        <Modal.Header closeButton>
                            <Modal.Title>{modal.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {modal.body}
                        </Modal.Body>
                    </Modal>
                ) : (<></>)
            }

            {
                showSearchSortFilter ? (
                    <SearchSortFilter
                        onSet={onSetSearchSortFilter}
                        originalList={originalSearchSortFilterList}
                        {...searchSortFilterOptions}
                    />
                ) : (<></>)
            }

            {
                centerActions || addButton ? (
                    <CenterWrapper>
                        {centerActions}
                        {
                            addButton ? (
                                <Button
                                    iconName={addButton.iconName ?? ICONS.PLUS}
                                    secondIconName={addButton.secondIconName}
                                    color={addButton.show ? (addButton.openColor ?? COLORS.ADDBUTTON_OPEN) : (addButton.closedColor ?? COLORS.ADDBUTTON_CLOSED)}
                                    text={addButton.show ? addButton.openText : addButton.closedText}
                                    onClick={addButton.onToggle}
                                />
                            ) : (<></>)
                        }
                    </CenterWrapper>
                ) : (<></>)
            }

            {
                hasItems ? (
                    children
                ) : (
                    <CenterWrapper>
                        {emptyText}
                    </CenterWrapper>
                )
            }
        </PageContentWrapper>
    );
}



