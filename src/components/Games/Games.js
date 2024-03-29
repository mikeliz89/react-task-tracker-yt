import Game from './Game';

export default function Games({ games, onDelete, onEdit }) {

  return (
    <div>
      {games.map((game) => (
        <Game key={game.id}
          game={game}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}