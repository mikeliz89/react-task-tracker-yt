import Game from './Game';

export default function Games({ games, onDelete, onEdit, dbUrl, detailsNavigation, showConsole }) {

  return (
    <div>
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