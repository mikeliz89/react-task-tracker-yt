import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import NavButton from '../Buttons/NavButton';
import Alert from '../Alert';
import StarRating from '../StarRating/StarRating';
import { COLORS } from '../../utils/Constants';
import { Modal } from 'react-bootstrap';

import RightWrapper from './RightWrapper';

export default function ListRow({
    className = '',
    onDoubleClick,
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
    actionsClassName = '',
    stopRightClickPropagation = false,
    showEditButton = false,
    editable,
    setEditable,
    showDeleteButton = false,
    actionsExtra,
    onDelete,
    deleteId,
    deleteSubId,
    alert,
    starCount,
    children,
    modal,
    modalTitle,
    modalBody,
    section,
}) {
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
            {starCount != null ? <StarRating starCount={starCount} /> : null}
        </div>
    );
}

