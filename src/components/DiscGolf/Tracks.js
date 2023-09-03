import Track from "./Track";

export default function Tracks({ tracks, onDelete }) {
    <>
        {
            tracks.map((track) => (
                <Track key={track.id} track={track} onDelete={onDelete} />
            ))
        }
    </>
}