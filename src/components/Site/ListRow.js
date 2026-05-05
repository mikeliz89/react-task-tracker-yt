import CheckButton from '../Buttons/CheckButton';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import NavButton from '../Buttons/NavButton';
import Alert from '../Alert';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import { updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { COLORS } from '../../utils/Constants';
import { Modal } from 'react-bootstrap';

import RightWrapper from './RightWrapper';

export default function ListRow({
    //item
    item,
    dbKey,
    //header
    headerProps = {},
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
    modalProps = {},
    //other
    children,
    section,
    actionsClassName = '',
    actionsExtra,
    className = '',
    showStarRating = true,
    showCheckButton = false,
    checkButtonProps = {},
    onEdit,
}) {
    // Purkaa headerProps
    const {
        prefix,
        left,
        title,
        titleTo,
        titleIcon,
        titleIconColor = COLORS.WHITE,
        titleWrapperClassName = '',
        titleClassName = '',
        suffix,
        as = 'h5',
        className: headerClassName = '',
        leftClassName = '',
    } = headerProps;

    const {
        modalTitle,
        modalBody
    } = modalProps;

    // Mark haveAtHome helpers for CheckButton
    const markHaveAtHome = () => {
        if (!item) {
            return;
        }
        item["haveAtHome"] = true;
        if (typeof onEdit === 'function') {
            onEdit(item);
        }
    };

    const markNotHaveAtHome = () => {
        if (!item) {
            return;
        }
        item["haveAtHome"] = false;
        if (typeof onEdit === 'function') {
            onEdit(item);
        }
    };

    // Tallennetaan tähdet Firebaseen käyttäen nykyistä item-oliota ja uutta stars-arvoa
    const saveStars = async (stars) => {
        if (!item || !item.id) {
            return;
        }
        // Varmistetaan, että stars-kenttä lisätään aina
        const updated = { ...item, stars: Number(stars), modified: getCurrentDateAsJson() };
        await updateToFirebaseById(dbKey, item.id, updated);
    };

    const HeaderTag = as;
    const hasActions = actionsExtra != null || showEditButton || showDeleteButton;
    const hasLeftContent = prefix != null
        || left != null
        || title != null
        || suffix != null;
    const hasHeader = hasLeftContent || hasActions;

    const titleNode = title != null
        ? (titleTo
            ? (
                <NavButton
                    to={titleTo}
                    className={titleClassName}
                    icon={titleIcon}
                    iconColor={titleIconColor}
                >
                    {title}
                </NavButton>
            )
            : <span className={titleClassName}>{title}</span>)
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
                    <div className={leftClassName}>
                        {prefix}
                        {left}
                        {titleNode != null
                            ? <span className={titleWrapperClassName}>{titleNode}</span>
                            : null}
                        {suffix}
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
            {showCheckButton && (
                <CheckButton
                    {...checkButtonProps}
                    onCheck={checkButtonProps.onCheck || markHaveAtHome}
                    onUncheck={checkButtonProps.onUncheck || markNotHaveAtHome}
                />
            )}
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

