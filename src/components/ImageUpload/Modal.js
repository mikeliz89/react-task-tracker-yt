import React from 'react';

export default function Modal({ selectedImage, setSelectedImage }) {

    const handleClick = (e) => {
        /* when clicking image itself, do not close modal */
        if (e.target.classList.contains('backdrop')) {
            setSelectedImage(null);
        }
    }
    return (
        <div className='backdrop' onClick={handleClick}>
            <img src={selectedImage} alt="enlarged pic" />
        </div>
    )
}