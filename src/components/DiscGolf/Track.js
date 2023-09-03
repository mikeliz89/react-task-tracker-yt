export default function Track({ track }) {

    return (
        <>
            <div className='listContainer'>
                <h5>
                    {track.trackName}
                </h5>
                <h6>Sijainti: {track.trackCity}</h6>
                <p>Kuvaus: {track.description}</p>
            </div>
        </>
    )
}