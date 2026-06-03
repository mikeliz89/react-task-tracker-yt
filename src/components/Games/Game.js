import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getGameConsoleNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';

import AddGame from './AddGame';

export default function Game({ item, onDelete, onEdit, dbUrl, detailsNavigation, showConsole }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    //states
    const [editable, setEditable] = useState(false);

    const updateGame = (updateGameID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(dbUrl, updateGameID, object);
        setEditable(false);
    }

    const gameTitle = `${item.name} ${item.publishYear > 0 ? `(${item.publishYear})` : ''}`.trim();

    return (
        <ListRow
            item={item}
            dbKey={dbUrl}
            headerProps={{
                title: gameTitle,
                titleTo: `${detailsNavigation}/${item.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <>
                    <p>
                        {item.format > 0 ?
                            (<span> {
                                t('game_format_' + getGameConsoleNameByID(item.format))
                            }</span>) : ('')}
                    </p>
                    <p>
                        {item.description}
                    </p>
                    {showConsole &&
                        <p>
                            {item.console > 0 ?
                                (<span> {
                                    t('game_console_' + getGameConsoleNameByID(item.console))
                                }</span>) : ('')}
                        </p>
                    }
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_game'),
                modalBody: (
                    <AddGame
                        gameID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateGame}
                        dbUrl={dbUrl}
                        showConsole={showConsole}
                        showLabels={true}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: !!item.haveAtHome,
                checkedText: t('have'),
                uncheckedText: t('have_not'),
                onCheck: () => { item["haveAtHome"] = true; onEdit(item); },
                onUncheck: () => { item["haveAtHome"] = false; onEdit(item); },
            }}
        />
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
    showConsole: PropTypes.bool,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}
