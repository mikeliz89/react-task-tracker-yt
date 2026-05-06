import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import ManagePage from '../Site/ManagePage';
import NavButton from '../Buttons/NavButton';
import { TRANSLATION, ICONS, COLORS } from '../../utils/Constants';

/**
 * Generic management page for Firebase collections.
 * @param {object} props
 * @param {string} props.dbKey - DB key (e.g. DB.GAMES)
 * @param {string} props.translationKey - TRANSLATION key (e.g. TRANSLATION.GAMES)
 * @param {React.Component} props.AddComponent - Add item modal component
 * @param {React.Component} props.ListComponent - List component
 */
export default function ManageGeneric({
    //db and translation
    dbKey,
    translationKey,
    //Components
    AddComponent = null,
    AddComponentProps = {},
    ListComponent,
    ListComponentProps = {},
    //search sort filter
    searchSortFilterOptions,
    //icon
    iconName,
    //topActions
    topActions,
    //listNav is used to create a generic list navigation button if topActions is not provided
    listNav,
    //title
    title,
    //copy button
    showCopyButton = false,
    // modal title override
    modalTitle
}) {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: translationKey });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { data, setData, originalData, counter, loading } = useFetch(dbKey);
    const [filteredData, setFilteredData] = useState([]);
    const { status: showAdd, toggleStatus: toggleAdd } = useToggle();
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    const { currentUser } = useAuth();

    const deleteItem = async (id) => {
        removeFromFirebaseById(dbKey, id);
    };

    const addItem = async (itemID, item) => {
        try {
            clearMessages();
            item["created"] = getCurrentDateAsJson();
            item["createdBy"] = currentUser.email;
            pushToFirebase(dbKey, item);
            showSuccess(tCommon('save_success'));
        } catch (ex) {
            showFailure(tCommon('save_exception'));
            console.warn(ex);
        }
    };

    const editItem = (item) => {
        const id = item.id;
        updateToFirebaseById(dbKey, id, item);
    }

    // Määritä näytettävä lista
    const listToShow = searchSortFilterOptions ? filteredData : data;

    // Luo topActions geneerisesti tarvittaessa
    let resolvedTopActions = topActions;
    // Jos topActions-proppia ei anneta ja listNav on annettu, luodaan geneerinen listapainike
    if (!resolvedTopActions && listNav) {
        resolvedTopActions = (
            <NavButton to={listNav.to} icon={listNav.icon ?? ICONS.LIST_ALT}>
                {listNav.text ?? tCommon('buttons.button_lists')}
            </NavButton>
        );
    }

    return (
        <ManagePage
            title={title ?? t('manage_title')}
            iconName={iconName}
            topActions={resolvedTopActions}
            alert={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
            }}
            copyButton={{
                show: showCopyButton,
                items: Array.isArray(listToShow) ? listToShow : (listToShow ? [listToShow] : [])
            }}
            addButton={AddComponent ? {
                show: showAdd,
                onToggle: toggleAdd
            } : undefined}
            loading={loading}
            searchSortFilter={searchSortFilterOptions ? {
                ...searchSortFilterOptions,
                originalList: originalData,
                onSet: setFilteredData
            } : undefined}
            hasItems={listToShow != null && listToShow.length > 0}
            emptyText={tCommon('nothing_to_show')}
            modal={AddComponent && showAdd ? {
                show: showAdd,
                onHide: toggleAdd,
                title: modalTitle ?? t('add'),
                body: <AddComponent show={showAdd}
                    onClose={toggleAdd}
                    onSave={addItem}
                    {...AddComponentProps} />
            } : undefined}
        >
            <ListComponent
                items={listToShow}
                originalList={Array.isArray(originalData) ? originalData : (originalData ? [originalData] : [])}
                counter={counter}
                onDelete={deleteItem}
                onEdit={editItem}
                {...ListComponentProps}
            />
        </ManagePage>
    );
}

ManageGeneric.propTypes = {
    dbKey: PropTypes.string.isRequired,
    translationKey: PropTypes.string.isRequired,
    AddComponent: PropTypes.elementType,
    ListComponent: PropTypes.elementType.isRequired,
    searchSortFilterOptions: PropTypes.object,
    iconName: PropTypes.string,
    topActions: PropTypes.node,
    listNav: PropTypes.shape({
        to: PropTypes.string,
        icon: PropTypes.string,
        text: PropTypes.string,
    }),
    ListComponentProps: PropTypes.object,
    AddComponentProps: PropTypes.object,
    title: PropTypes.node,
    modalTitle: PropTypes.string,
};