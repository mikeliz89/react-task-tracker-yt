import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import Icon from '../Icon';
import PageTitle from './PageTitle';
import PageContentWrapper from './PageContentWrapper';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ICONS, COLORS, TRANSLATION } from '../../utils/Constants';

export default function DetailsPage({
    loading,
    loadingText,
    showEditButton = false,
    isEditOpen = false,
    onToggleEdit,
    title,
    titleSuffix,
    topContent,
    preSummaryContent,
    summary,
    ratingSection,
    metaItems,
    editSection,
    alertSection,
    alertColLg = 12,
    imageSection,
    imageColLg = 12,
    commentSection,
    commentColLg = 12,
    linkSection,
    linkColLg = 12,
    children
}) {
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    if (loading) {
        return <h3>{loadingText || tCommon('loading')}</h3>;
    }

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
                            {typeof title === 'string' ? <PageTitle title={title} /> : title}
                            {titleSuffix && <div className="detailspage-title-suffix">{titleSuffix}</div>}
                            {ratingSection && <div className="detailspage-rating-row">{ratingSection}</div>}
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

                {editSection && <div className="detailspage-edit-card">{editSection}</div>}

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

                {imageSection && (
                    <div className="detailspage-image-section">
                        <Row className="detailspage-grid">
                            <Col lg={imageColLg}>
                                {imageSection}
                            </Col>
                        </Row>
                    </div>
                )}

                {commentSection && (
                    <div className="detailspage-comment-section">
                        <Row className="detailspage-grid">
                            <Col lg={commentColLg}>
                                {commentSection}
                            </Col>
                        </Row>
                    </div>
                )}

                {linkSection && (
                    <div className="detailspage-link-section">
                        <Row className="detailspage-grid">
                            <Col lg={linkColLg}>
                                {linkSection}
                            </Col>
                        </Row>
                    </div>
                )}

                {children}
            </div>
        </PageContentWrapper>
    );
}