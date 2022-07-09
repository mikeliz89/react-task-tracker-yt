import React from 'react'

function GymParts({ parts }) {
    return (
        <div>
            {parts.map((row) => (
                <p key={row.id}>{row.name}</p>
            ))}
        </div>
    )
}

export default GymParts

