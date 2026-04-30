import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getGameConsoleNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import ListRow from '../Site/ListRow';

import AddGame from './AddGame';

export default function Game({ game, onDelete, onEdit, dbUrl, detailsNavigation, showConsole }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    //states
    const [editable, setEditable] = useState(false);

    const updateGame = (updateGameID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(dbUrl, updateGameID, object);
        setEditable(false);
    }

    const markHaveAtHome = () => {
        game["haveAtHome"] = true;
        onEdit(game);
    }

    const markNotHaveAtHome = () => {
        game["haveAtHome"] = false;
        onEdit(game);
    }

    const gameTitle = `${game.name} ${game.publishYear > 0 ? `(${game.publishYear})` : ''}`.trim();

    return (
        <ListRow
            item={game}
            dbKey={dbUrl}
            headerTitle={gameTitle}
            headerTitleTo={`${detailsNavigation}/${game.id}`}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={game.id}
            section={
                <>
                    <p>
                        {game.format > 0 ?
                            (<span> {
                                t('game_format_' + getGameConsoleNameByID(game.format))
                            }</span>) : ('')}
                    </p>
                    <p>
                        {game.description}
                    </p>
                    {showConsole &&
                        <p>
                            {game.console > 0 ?
                                (<span> {
                                    t('game_console_' + getGameConsoleNameByID(game.console))
                                }</span>) : ('')}
                        </p>
                    }
                </>
            }
            modalTitle={t('modal_header_edit_game')}
            modalBody={
                <AddGame
                    gameID={game.id}
                    onClose={() => setEditable(false)}
                    onSave={updateGame}
                    dbUrl={dbUrl}
                    showConsole={showConsole}
                    showLabels={true} />
            }
        >
            <CheckButton
                checked={game.haveAtHome}
                checkedText={t('have')}
                uncheckedText={t('have_not')}
                onCheck={markHaveAtHome}
                onUncheck={markNotHaveAtHome}
                style={{ margin: '5px' }}
            />
        </ListRow>
    )
}

Game.defaultProps = {
    dbUrl: DB.GAMES,
    detailsNavigation: NAVIGATION.GAME,
    showConsole: true
}

Game.propTypes = {
    dbUrl: PropTypes.string,
    detailsNavigation: PropTypes.string,
    showConsole: PropTypes.bool
}
