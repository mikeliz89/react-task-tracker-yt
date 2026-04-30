import { Row, Col, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION } from '../../utils/Constants';
import PageContentWrapper from './PageContentWrapper';
import PageTitle from './PageTitle';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import { updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';

export default function DetailsPage({
    //loading
    loading,
    loadingText,
    //title
    title,
    titleSuffix,
    topContent,
    //summary
    preSummaryContent,
    summary,
    //edit
    editSection,
    editModalTitle,
    showEditButton = false,
    isEditOpen = false,
    onToggleEdit,
    //alert
    alertSection,
    alertColLg = 12,
    //image
    preImageSection,
    preImageColLg = 12,
    imageSection,
    imageColLg = 12,
    //comment
    commentSection,
    commentColLg = 12,
    //link
    linkSection,
    linkColLg = 12,
    //other
    children,
    metaItems,
    showStarRating = true,
    //item, id, dbkey
    id,
    item,
    dbKey,
}) {
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    if (loading) {
        return <h3>{loadingText || tCommon('loading')}</h3>;
    }

    // Tallennetaan tähdet Firebaseen käyttäen item.id:tä ja item-oliota
    const saveStars = async (stars) => {
        console.log('Saving stars:', stars);
        if (!item || !id) {
            return;
        }
        const updated = { ...item, modified: getCurrentDateAsJson(), stars: Number(stars) };
        await updateToFirebaseById(dbKey || '', id, updated);
    };

    return (
        <PageContentWrapper>
            <div className="detailspage-page">
                <div className="detailspage-header">
                    <div className="detailspage-actions-row">
                        <GoBackButton />
                        {showEditButton && (
                            <Button
                                iconName={ICONS.EDIT}
                                text={isEditOpen ? tCommon('buttons.button_close') : tCommon('buttons.button_edit')}
                                color={isEditOpen ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
                                onClick={onToggleEdit}
                            />
                        )}
                    </div>

                    <div className="detailspage-top-row">
                        <div className="detailspage-title-wrap">
                            <div className="detailspage-title-row">
                                {typeof title === 'string' ? <PageTitle title={title} /> : title}
                                {titleSuffix && <div className="detailspage-title-suffix">{titleSuffix}</div>}
                            </div>
                            {showStarRating && (
                                <div className="detailspage-rating-row">
                                    {/* {typeof item?.stars === 'number' && !isNaN(item.stars) ? item.stars : 0} */}
                                    <StarRatingWrapper
                                        stars={item?.stars != null && !isNaN(Number(item.stars)) ? Number(item.stars) : 0}
                                        onSaveStars={saveStars}
                                    />
                                </div>
                            )}
                            {topContent}
                        </div>
                    </div>

                    {preSummaryContent && <div className="detailspage-pre-summary">{preSummaryContent}</div>}

                    {summary && <p className="detailspage-summary">{summary}</p>}

                    <div className="detailspage-meta-row">
                        <span className="detailspage-meta-history-icon">
                            <Icon name={ICONS.HISTORY} color="#8f9bb3" fontSize="0.95rem" />
                        </span>
                        {metaItems && metaItems.map((metaItem, index) => <span key={metaItem?.id || index}>{metaItem?.content}</span>)}
                    </div>
                </div>

                {editSection && (
                    <Modal show={Boolean(isEditOpen)} onHide={onToggleEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{editModalTitle || tCommon('buttons.button_edit')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {editSection}
                        </Modal.Body>
                    </Modal>
                )}

                <hr></hr>

                {alertSection && (
                    <div className="detailspage-alert-section">
                        <Row className="detailspage-grid">
                            <Col lg={alertColLg}>
                                {alertSection}
                            </Col>
                        </Row>
                    </div>
                )}

                {preImageSection && (
                    <div className="detailspage-pre-image-section">
                        <Row className="detailspage-grid">
                            <Col lg={preImageColLg}>
                                {preImageSection}
                            </Col>
                        </Row>
                    </div>
                )}

                {(imageSection || commentSection || linkSection) && (
                    <div className="detailspage-content-columns">
                        <Row className="detailspage-columns-row g-3">
                            {(imageSection || linkSection) && (
                                <Col xs={12} md={commentSection ? 6 : 12}>
                                    {imageSection && (
                                        <div className="detailspage-image-section">
                                            {imageSection}
                                        </div>
                                    )}
                                    {linkSection && (
                                        <div className="detailspage-link-section">
                                            {linkSection}
                                        </div>
                                    )}
                                </Col>
                            )}

                            {commentSection && (
                                <Col xs={12} md={(imageSection || linkSection) ? 6 : 12}>
                                    <div className="detailspage-comment-section">
                                        {commentSection}
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}

                {children}
            </div>
        </PageContentWrapper>
    );
}


