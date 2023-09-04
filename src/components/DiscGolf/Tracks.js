import Track from "./Track";

export default function Tracks({ tracks, onDelete }) {

    return (
        <>
            {
                tracks.map((track) => (
                    <Track key={track.id} track={track} onDelete={onDelete} />
                ))
            }
        </>
    )
}