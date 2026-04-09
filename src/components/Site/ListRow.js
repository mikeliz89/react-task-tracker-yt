import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import Alert from '../Alert';
import StarRating from '../StarRating/StarRating';

import RightWrapper from './RightWrapper';

export default function ListRow({
    className = '',
    onDoubleClick,
    headerLeft,
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
}) {
    const HeaderTag = headerAs;
    const hasActions = actionsExtra != null || showEditButton || showDeleteButton;
    const hasHeader = headerLeft != null || hasActions;

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
                    <div className={headerLeftClassName}>{headerLeft}</div>
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
            {children}
            {starCount != null ? <StarRating starCount={starCount} /> : null}
        </div>
    );
}

