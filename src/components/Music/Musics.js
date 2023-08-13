import Music from './Music';

export default function Musics({ musics, onDelete, onEdit }) {

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