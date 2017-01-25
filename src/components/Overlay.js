import React from 'react';

export const Overlay = ({ title, visibility, onClick}) => (
    <div className={ ['overlay', visibility ? 'show' : ''].join(' ') }>
        <div className="overlay__inner">
            <h1 className="overlay__title">
                {title}
            </h1>
            <span onClick={onClick} className="overlay__link">
                start over
            </span>
        </div>
    </div>
);
