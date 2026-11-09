import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { ICONS, TRANSLATION, VARIANTS } from '../../utils/Constants';
import Alert from '../Alert';
import Icon from '../Icon';
import QuickWeightEntryModal from '../Dashboard/QuickWeightEntryModal';

export default function HeaderQuickActions() {
    const { currentUser } = useAuth();
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { t: tDashboard } = useTranslation(TRANSLATION.DASHBOARD, { keyPrefix: TRANSLATION.DASHBOARD_BUTTONS });
    const { t: tBmi } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BMICALCULATOR });
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [showWeightEntry, setShowWeightEntry] = useState(false);
    const [quickActionMessage, setQuickActionMessage] = useState('');
    const quickActionsWrapperRef = useRef(null);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (quickActionsWrapperRef.current && !quickActionsWrapperRef.current.contains(event.target)) {
                setShowQuickActions(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, []);

    if (!currentUser) {
        return null;
    }

    return (
        <>
            <div className='header-notification-wrap header-quick-actions-wrap' ref={quickActionsWrapperRef}>
                <button
                    type='button'
                    className={`header-notification-button dashboard-quick-actions-toggle${showQuickActions ? ' is-open' : ''}`}
                    title={tDashboard(showQuickActions ? 'close_quick_actions' : 'open_quick_actions')}
                    aria-label={tDashboard(showQuickActions ? 'close_quick_actions' : 'open_quick_actions')}
                    aria-expanded={showQuickActions}
                    aria-controls='header-quick-actions-panel'
                    onClick={() => setShowQuickActions((isOpen) => !isOpen)}
                >
                    <Icon name={ICONS.PLUS} />
                </button>

                {showQuickActions && (
                    <div
                        id='header-quick-actions-panel'
                        className='header-notification-panel'
                        role='group'
                        aria-label={tDashboard('quick_actions')}
                    >
                        <h6 className='header-notification-title'>{tDashboard('quick_actions')}</h6>
                        <Alert
                            message={quickActionMessage}
                            showMessage={Boolean(quickActionMessage)}
                            onClose={() => setQuickActionMessage('')}
                            variant={VARIANTS.SUCCESS}
                        />
                        <button
                            type='button'
                            className='header-notification-item dashboard-quick-action'
                            onClick={() => {
                                setQuickActionMessage('');
                                setShowQuickActions(false);
                                setShowWeightEntry(true);
                            }}
                        >
                            <span className='header-notification-item-name d-flex align-items-center gap-2'>
                                <Icon name={ICONS.WEIGHT} />
                                {tDashboard('quick_action_log_weight')}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {showWeightEntry && (
                <QuickWeightEntryModal
                    show={showWeightEntry}
                    onHide={() => setShowWeightEntry(false)}
                    onSaved={(bmi) => {
                        setQuickActionMessage(`${tCommon('save_success')}. ${tBmi('your_bmi_is')}: ${bmi}`);
                        setShowQuickActions(true);
                    }}
                />
            )}
        </>
    );
}
