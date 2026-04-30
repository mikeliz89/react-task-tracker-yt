import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import NavButton from '../Buttons/NavButton';
import Alert from '../Alert';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import { updateToFirebaseById } from '../../datatier/datatier';
import { DB } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { COLORS } from '../../utils/Constants';
import { Modal } from 'react-bootstrap';

import RightWrapper from './RightWrapper';

export default function ListRow({
    //item
    item,
    dbKey,
    //header
    headerPrefix,
    headerLeft,
    headerTitle,
    headerTitleTo,
    headerTitleIcon,
    headerTitleIconColor = COLORS.WHITE,
    headerTitleWrapperClassName = '',
    headerTitleClassName = '',
    headerSuffix,
    headerAs = 'h5',
    headerClassName = '',
    headerLeftClassName = '',
    //buttons
    showEditButton = false,
    showDeleteButton = false,
    editable,
    setEditable,
    stopRightClickPropagation = false,
    onDoubleClick,
    //delete
    onDelete,
    deleteId,
    deleteSubId,
    //alert
    alert,
    //modal
    modal,
    modalTitle,
    modalBody,
    //other
    children,
    section,
    actionsClassName = '',
    actionsExtra,
    className = '',
    showStarRating = true,
}) {

    // Tallennetaan tähdet Firebaseen käyttäen nykyistä item-oliota ja uutta stars-arvoa
    const saveStars = async (stars) => {
        if (!item || !item.id) {
            return;
        }
        const updated = { ...item, modified: getCurrentDateAsJson(), stars: Number(stars) };
        await updateToFirebaseById(dbKey, item.id, updated);
    };

    const HeaderTag = headerAs;
    const hasActions = actionsExtra != null || showEditButton || showDeleteButton;
    const hasLeftContent = headerPrefix != null
        || headerLeft != null
        || headerTitle != null
        || headerSuffix != null;
    const hasHeader = hasLeftContent || hasActions;

    const titleNode = headerTitle != null
        ? (headerTitleTo
            ? (
                <NavButton
                    to={headerTitleTo}
                    className={headerTitleClassName}
                    icon={headerTitleIcon}
                    iconColor={headerTitleIconColor}
                >
                    {headerTitle}
                </NavButton>
            )
            : <span className={headerTitleClassName}>{headerTitle}</span>)
        : null;

    return (
        <div className={`listContainer ${className}`.trim()} onDoubleClick={onDoubleClick}>
            {alert ? (
                <Alert
                    message={alert.message}
                    showMessage={alert.showMessage}
                    error={alert.error}
                    showError={alert.showError}
                    variant={alert.variant}
                    onClose={alert.onClose}
                />
            ) : null}

            {hasHeader && (
                <HeaderTag className={headerClassName}>
                    <div className={headerLeftClassName}>
                        {headerPrefix}
                        {headerLeft}
                        {titleNode != null
                            ? <span className={headerTitleWrapperClassName}>{titleNode}</span>
                            : null}
                        {headerSuffix}
                    </div>
                    {hasActions && (
                        <div
                            className={actionsClassName}
                            onClick={stopRightClickPropagation ? (e) => e.stopPropagation() : undefined}
                        >
                            <RightWrapper>
                                {actionsExtra}
                                {showEditButton && (
                                    <EditButton
                                        editable={editable}
                                        setEditable={setEditable}
                                    />
                                )}
                                {showDeleteButton && (
                                    <DeleteButton
                                        onDelete={onDelete}
                                        id={deleteId}
                                        subId={deleteSubId}
                                    />
                                )}
                            </RightWrapper>
                        </div>
                    )}
                </HeaderTag>
            )}
            {section}
            {children}
            {editable && (
                <Modal show={editable} onHide={() => setEditable(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalBody}
                    </Modal.Body>
                </Modal>
            )}
            {showStarRating && (
                <StarRatingWrapper
                    stars={Number(item?.stars) || 0}
                    onSaveStars={saveStars}
                />
            )}
        </div>
    );
}

