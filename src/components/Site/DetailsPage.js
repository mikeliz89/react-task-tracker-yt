import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import Icon from '../Icon';
import PageTitle from './PageTitle';
import PageContentWrapper from './PageContentWrapper';
import { ICONS } from '../../utils/Constants';

export default function DetailsPage({
    loading,
    loadingText,
    showGoBackButton = true,
    showEditButton = false,
    isEditOpen = false,
    editButtonClosedText = '',
    editButtonOpenText = '',
    editButtonIconName,
    editButtonOpenColor,
    editButtonClosedColor,
    onToggleEdit,
    title,
    titleSuffix,
    topContent,
    preSummaryContent,
    summary,
    ratingSection,
    metaItems,
    editSection,
    children
}) {
    if (loading) {
        return <h3>{loadingText}</h3>;
    }

    return (
        <PageContentWrapper>
            <div className="detailspage-page">
                <div className="detailspage-header">
                    <div className="detailspage-actions-row">
                        {showGoBackButton && <GoBackButton />}
                        {showEditButton && (
                            <Button
                                iconName={editButtonIconName}
                                text={isEditOpen ? editButtonOpenText : editButtonClosedText}
                                color={isEditOpen ? editButtonOpenColor : editButtonClosedColor}
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

                {children}
            </div>
        </PageContentWrapper>
    );
}