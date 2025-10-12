import { useTranslation } from 'react-i18next';
import { FaCheckSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getGameConsoleNameByID } from '../../utils/ListUtils';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddGame from './AddGame';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function Game({ game, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    //states
    const [editable, setEditable] = useState(false);

    const updateGame = (updateGameID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.GAMES, updateGameID, object);
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

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {game.name} {game.publishYear > 0 ? '(' + game.publishYear + ')' : ''}
                </span>
                <RightWrapper>
                    <EditButton
                        editable={editable}
                        setEditable={setEditable}
                    />
                    <DeleteButton
                        onDelete={onDelete}
                        id={game.id}
                    />
                </RightWrapper>
            </h5>
            {!editable &&
                <p>
                    {game.format > 0 ?
                        (<span> {
                            t('game_format_' + getGameConsoleNameByID(game.format))
                        }</span>) : ('')}
                </p>
            }
            {!editable &&
                <p>
                    {game.description}
                </p>
            }
            {!editable &&
                <p>
                    {game.console > 0 ?
                        (<span> {
                            t('game_console_' + getGameConsoleNameByID(game.console))
                        }</span>) : ('')}
                </p>
            }
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${NAVIGATION.GAME}/${game.id}`}>{t('view_details')}</Link>
                </p>
            }
            <StarRating starCount={game.stars} />

            {
                editable && <AddGame
                    gameID={game.id}
                    onClose={() => setEditable(false)}
                    onSave={updateGame}
                    showLabels={false} />
            }

            <p>
                {
                    game.haveAtHome &&
                    <span
                        onClick={() => { markNotHaveAtHome() }}
                        className='btn btn-success' style={{ margin: '5px' }}>
                        {t('have')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {
                    !game.haveAtHome &&
                    <span
                        onClick={() => { markHaveAtHome() }}
                        className='btn btn-danger' style={{ margin: '5px' }}>
                        {t('have_not')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
            </p>
        </div>
    )
}