export default function Round({ round }) {

    return (
        <>
            <div className='listContainer'>
                <h5>
                    {round.trackName}
                </h5>
                <p> {round.description}</p>
            </div>
        </>
    )
}