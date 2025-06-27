import React from 'react';

// Function to create a tag for the values
const ValuesTag = ({ label, onClick}) => {
    return (
        <span className="values-tag" onClick={onClick}>
            {label}
        </span>

    );
};


export default ValuesTag;
