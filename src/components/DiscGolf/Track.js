export default function Track({ track }) {

    return (
        <>
            <div className='listContainer'>
                <h5>
                    {track.trackName}
                </h5>
                <p> {track.description}</p>
            </div>
        </>
    )
}