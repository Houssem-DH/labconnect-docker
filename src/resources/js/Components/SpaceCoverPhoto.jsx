import React from "react";
import background_image from "/public/assets/img/background_image.jpg";

const SpaceCover = ({ lab }) => {
    return (
        <div className="relative w-full h-72 rounded-t-lg overflow-hidden shadow-lg">
            {lab.picture ? (
                <img
                    src={`storage/${lab.picture}`}
                    alt="Background Photo"
                    className="object-cover w-full h-full"
                />
            ) : (
                <img
                    src={background_image}
                    alt="Background Photo"
                    className="object-cover w-full h-full"
                />
            )}
        </div>
    );
};

export default SpaceCover;
