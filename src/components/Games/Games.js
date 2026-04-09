import Game from './Game';
import Counter from '../Site/Counter';

export default function Games({ games, onDelete, onEdit, dbUrl, detailsNavigation, showConsole, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={games} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {games.map((game) => (
        <Game key={game.id}
          game={game}
          onDelete={onDelete}
          onEdit={onEdit}
          dbUrl={dbUrl}
          detailsNavigation={detailsNavigation}
          showConsole={showConsole} />
      ))}
    </div>
  )
}