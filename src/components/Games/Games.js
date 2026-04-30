import Counter from '../Site/Counter';

import Game from './Game';

export default function Games({ items, onDelete, onEdit, dbUrl, detailsNavigation, showConsole, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {items.map((game) => (
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


