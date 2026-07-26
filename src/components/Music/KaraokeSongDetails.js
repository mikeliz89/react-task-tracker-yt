import i18n from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, COLORS, ICONS } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import useFetchChildren from '../Hooks/useFetchChildren';
import { useToggle } from '../Hooks/useToggle';
import Button from '../Buttons/Button';
import CenterWrapper from '../Site/CenterWrapper';
import DetailsPage from '../Site/DetailsPage';

import AddKaraokeLyricRow from './AddKaraokeLyricRow';
import KaraokeLyricRow from './KaraokeLyricRow';
import AddKaraokeSong from './AddKaraokeSong';

function parseTimestampToSeconds(value) {
    if (!value || typeof value !== 'string') {
        return Number.MAX_SAFE_INTEGER;
    }

    const parts = value
        .trim()
        .split(':')
        .map((part) => Number(part));

    if (parts.some((part) => Number.isNaN(part))) {
        return Number.MAX_SAFE_INTEGER;
    }

    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return (minutes * 60) + seconds;
    }

    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    return Number.MAX_SAFE_INTEGER;
}

function formatSecondsToTimestamp(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getCurrentLineProgress({ isPlaying, elapsedSeconds, currentLyric, nextLyric }) {
    if (!isPlaying || !currentLyric) {
        return 0;
    }

    const currentStart = Number(currentLyric.parsedIndex);
    const nextStart = nextLyric ? Number(nextLyric.parsedIndex) : Number.NaN;
    const fallbackDurationSeconds = 4;

    const duration = Number.isFinite(nextStart) && nextStart > currentStart
        ? (nextStart - currentStart)
        : fallbackDurationSeconds;

    const progress = (elapsedSeconds - currentStart) / duration;
    return Math.max(0, Math.min(1, progress));
}

export default function KaraokeSongDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    //states
    const [showAddLyricRow, setShowAddLyricRow] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    //fetch data
    const { data: song, loading } = useFetch(DB.MUSIC_KARAOKE_SONGS, '', params.id);
    const { data: lyricRows } = useFetchChildren(DB.MUSIC_KARAOKE_SONG_LYRICS, params.id);
    const lyricRowsArray = Array.isArray(lyricRows) ? lyricRows : [];

    const sortedLyricRows = [...lyricRowsArray].sort((a, b) => {
        const aIndex = Number.isFinite(Number(a.sortIndex)) ? Number(a.sortIndex) : parseTimestampToSeconds(a.timestamp);
        const bIndex = Number.isFinite(Number(b.sortIndex)) ? Number(b.sortIndex) : parseTimestampToSeconds(b.timestamp);
        return aIndex - bIndex;
    });

    const lyricTimeline = useMemo(() => (
        sortedLyricRows
            .map((row) => {
                const parsedIndex = Number.isFinite(Number(row.sortIndex))
                    ? Number(row.sortIndex)
                    : parseTimestampToSeconds(row.timestamp);

                return {
                    ...row,
                    parsedIndex,
                };
            })
            .filter((row) => Number.isFinite(row.parsedIndex) && row.parsedIndex !== Number.MAX_SAFE_INTEGER)
    ), [sortedLyricRows]);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        const intervalId = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [isPlaying]);

    const getCurrentLyricIndex = () => {
        if (lyricTimeline.length === 0) {
            return -1;
        }

        let currentIndex = -1;
        for (let i = 0; i < lyricTimeline.length; i++) {
            if (lyricTimeline[i].parsedIndex <= elapsedSeconds) {
                currentIndex = i;
            } else {
                break;
            }
        }

        return currentIndex;
    };

    const currentLyricIndex = getCurrentLyricIndex();
    const currentLyric = currentLyricIndex >= 0 ? lyricTimeline[currentLyricIndex] : null;
    const nextLyric = currentLyricIndex >= 0
        ? (lyricTimeline[currentLyricIndex + 1] || null)
        : (lyricTimeline[0] || null);
    const currentLineProgress = getCurrentLineProgress({
        isPlaying,
        elapsedSeconds,
        currentLyric,
        nextLyric,
    });

    const currentLyricText = currentLyric?.lyric || '';
    const currentLyricChars = currentLyricText.split('');
    const highlightedCharsCount = Math.floor(currentLyricChars.length * currentLineProgress);

    const updateSong = async (updateSongID, updatedSong) => {
        try {
            const songID = params.id;
            updatedSong['modified'] = getCurrentDateAsJson();
            updateToFirebaseById(DB.MUSIC_KARAOKE_SONGS, songID, updatedSong);
        } catch (saveError) {
            showFailure(t('failed_to_save_music'));
            console.warn(saveError);
        }
    };

    const addLyricRow = async (songID, lyricRow) => {
        pushToFirebaseChild(DB.MUSIC_KARAOKE_SONG_LYRICS, songID, lyricRow);
    };

    const deleteLyricRow = async (songID, lyricRowID) => {
        removeFromFirebaseByIdAndSubId(DB.MUSIC_KARAOKE_SONG_LYRICS, songID, lyricRowID);
    };

    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    const stopPlayback = () => {
        setIsPlaying(false);
        setElapsedSeconds(0);
    };

    return (
        <DetailsPage
            item={song}
            id={params.id}
            dbKey={DB.MUSIC_KARAOKE_SONGS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={toggleShowEdit}
            title={song?.name}
            summary={`${t('description')}: ${song?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className='detailspage-meta-label'>{t('created')}:</span> <span className='detailspage-meta-value'>{getJsonAsDateTimeString(song?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className='detailspage-meta-label'>{t('created_by')}:</span> <span className='detailspage-meta-value'>{song?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className='detailspage-meta-label'>{t('modified')}:</span> <span className='detailspage-meta-value'>{getJsonAsDateTimeString(song?.modified, i18n.language)}</span></>
                }
            ]}
            editModalTitle={t('modal_header_edit_karaoke_song')}
            editSection={<AddKaraokeSong onSave={updateSong} songID={params.id} onClose={toggleShowEdit} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
                alertColLg: 12,
            }}
            preImageSection={
                <>
                    <h5>{t('karaoke_lyrics_header')}</h5>

                    <ButtonGroup className='mb-2'>
                        <Button
                            text={isPlaying ? t('button_pause_karaoke') : t('button_play_karaoke')}
                            color={isPlaying ? '#b44545' : '#2b7a4b'}
                            onClick={togglePlay}
                        />
                        <Button
                            text={t('button_stop_karaoke')}
                            color={COLORS.BUTTON_GRAY}
                            onClick={stopPlayback}
                        />
                        <Button
                            iconName={ICONS.PLUS}
                            color={showAddLyricRow ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                            text={showAddLyricRow ? tCommon('buttons.button_close') : t('button_add_karaoke_lyric_row')}
                            onClick={() => setShowAddLyricRow(!showAddLyricRow)}
                        />
                    </ButtonGroup>

                    <div className='karaoke-player-panel'>
                        <div className='karaoke-player-time'>
                            {t('karaoke_elapsed_time')}: {formatSecondsToTimestamp(elapsedSeconds)}
                        </div>

                        <div className='karaoke-player-row karaoke-player-row-current'>
                            <span className='karaoke-player-row-label'>{t('karaoke_current_line')}:</span>{' '}
                            <span className='karaoke-player-row-text'>
                                {currentLyric ? (
                                    <>
                                        <span className='karaoke-player-row-time'>{currentLyric.timestamp}</span>{' '}
                                        <span className='karaoke-player-lyric-progress'>
                                            {currentLyricChars.map((character, index) => (
                                                <span
                                                    key={`karaoke-char-${index}`}
                                                    className={index < highlightedCharsCount
                                                        ? 'karaoke-char-sung'
                                                        : 'karaoke-char-pending'}
                                                >
                                                    {character}
                                                </span>
                                            ))}
                                        </span>
                                    </>
                                ) : '-'}
                            </span>
                        </div>

                        <div className='karaoke-player-row karaoke-player-row-next'>
                            <span className='karaoke-player-row-label'>{t('karaoke_next_line')}:</span>{' '}
                            <span className='karaoke-player-row-text'>
                                {nextLyric ? `${nextLyric.timestamp} ${nextLyric.lyric}` : '-'}
                            </span>
                        </div>
                    </div>

                    {showAddLyricRow && (
                        <AddKaraokeLyricRow
                            songID={params.id}
                            onSave={addLyricRow}
                            onClose={() => setShowAddLyricRow(false)}
                        />
                    )}

                    {sortedLyricRows.length > 0 ? (
                        sortedLyricRows.map((lyricRow) => (
                            <KaraokeLyricRow
                                key={lyricRow.id}
                                lyricRow={lyricRow}
                                songID={params.id}
                                onDelete={deleteLyricRow}
                            />
                        ))
                    ) : (
                        <CenterWrapper>
                            {t('no_karaoke_lyrics_to_show')}
                        </CenterWrapper>
                    )}
                </>
            }
            imageProps={{
                showImage: false
            }}
            commentProps={{
                showComment: false
            }}
            linkProps={{
                showLink: false
            }}
        />
    );
}
