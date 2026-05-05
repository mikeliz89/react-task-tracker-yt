import PropTypes from 'prop-types';
import { Row, Col, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, ICONS, COLORS } from '../../utils/Constants';
import PageContentWrapper from './PageContentWrapper';
import PageTitle from './PageTitle';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import ImageComponent from '../ImageUpload/ImageComponent';
import CommentComponent from '../Comments/CommentComponent';
import LinkComponent from '../Links/LinkComponent';

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
    alertProps = {},
    //image
    preImageSection,
    preImageColLg = 12,
    imageProps = {},
    //comment
    commentProps = {},
    //link
    linkProps = {},
    //other
    children,
    metaItems,
    showStarRating = true,
    //item, id, dbkey
    id,
    item,
    dbKey,
}) {

    const { currentUser } = useAuth();
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    if (loading) {
        return <h3>{loadingText || tCommon('loading')}</h3>;
    }

    // Luo oletus imageSection, commentSection ja linkSection, jos niitä ei anneta
    const {
        showImage = true,
        imageColLg = 12,
        imageUrl,
        ...restImageProps
    } = imageProps;

    const {
        showComment = true,
        commentColLg = 12,
        commentUrl,
        ...restCommentProps
    } = commentProps;

    const {
        showLink = true,
        linkColLg = 12,
        linkUrl,
        ...restLinkProps
    } = linkProps;

    // Tallennetaan tähdet Firebaseen käyttäen item.id:tä ja item-oliota
    const saveStars = async (stars) => {
        if (!item || !id) {
            return;
        }
        const updated = { ...item, modified: getCurrentDateAsJson(), stars: Number(stars) };
        await updateToFirebaseById(dbKey || '', id, updated);
    };

    const saveComment = async (comment) => {
        const commentUrl = commentProps?.commentUrl;
        if (!commentUrl || !id || !currentUser) return;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        await pushToFirebaseChild(commentUrl, id, comment);
    };

    const saveLink = async (link) => {
        const linkUrl = linkProps?.linkUrl;
        if (!linkUrl || !id) return;
        link["created"] = getCurrentDateAsJson();
        await pushToFirebaseChild(linkUrl, id, link);
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

                {(alertProps.message || alertProps.error || alertProps.showMessage || alertProps.showError) && (
                    <div className="detailspage-alert-section">
                        <Row className="detailspage-grid">
                            <Col lg={alertProps.alertColLg ?? 12}>
                                <Alert {...alertProps} />
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

                {(showImage || showComment || showLink) && (
                    <div className="detailspage-content-columns">
                        <Row className="detailspage-columns-row g-3">
                            {(showImage || showLink) && (
                                <Col xs={12} md={showComment ? 6 : 12}>
                                    {showImage && (
                                        <div className="detailspage-image-section">
                                            <ImageComponent objID={id} url={imageUrl} {...restImageProps} />
                                        </div>
                                    )}
                                    {showLink && (
                                        <div className="detailspage-link-section">
                                            <LinkComponent objID={id} url={linkUrl} onSaveLink={saveLink} {...restLinkProps} />
                                        </div>
                                    )}
                                </Col>
                            )}

                            {showComment && (
                                <Col xs={12} md={(showImage || showLink) ? 6 : 12}>
                                    <div className="detailspage-comment-section">
                                        <CommentComponent objID={id} url={commentUrl} onSave={saveComment} {...restCommentProps} />
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

DetailsPage.propTypes = {
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    titleSuffix: PropTypes.node,
    topContent: PropTypes.node,
    preSummaryContent: PropTypes.node,
    summary: PropTypes.node,
    editSection: PropTypes.node,
    editModalTitle: PropTypes.node,
    showEditButton: PropTypes.bool,
    isEditOpen: PropTypes.bool,
    onToggleEdit: PropTypes.func,
    alertProps: PropTypes.shape({
        message: PropTypes.string,
        showMessage: PropTypes.bool,
        error: PropTypes.string,
        showError: PropTypes.bool,
        onClose: PropTypes.func,
        variant: PropTypes.string,
        alertColLg: PropTypes.number,
    }),
    //pre-image
    preImageSection: PropTypes.node,
    preImageColLg: PropTypes.number,
    //image
    imageProps: PropTypes.shape({
        showImage: PropTypes.bool,
        imageColLg: PropTypes.number,
        imageUrl: PropTypes.string,
    }),
    //comment
    commentProps: PropTypes.shape({
        showComment: PropTypes.bool,
        commentColLg: PropTypes.number,
        commentUrl: PropTypes.string,
        onSave: PropTypes.func,
    }),
    //links
    linkProps: PropTypes.shape({
        showLink: PropTypes.bool,
        linkColLg: PropTypes.number,
        linkUrl: PropTypes.string,
    }),
    children: PropTypes.node,
    metaItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any,
        content: PropTypes.node
    })),
    showStarRating: PropTypes.bool,
    id: PropTypes.any,
    item: PropTypes.object,
    dbKey: PropTypes.string,
};