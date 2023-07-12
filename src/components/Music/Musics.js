import Music from './Music';

const Musics = ({ musics, onDelete, onEdit }) => {

  return (
    <div>
      {musics.map((music) => (
        <Music key={music.id}
          music={music}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}

export default Musics
