import React from 'react';
import Loader from "../assets/logos/Loader.json"
import Lottie from "lottie-react";
function Loading(props) {
    return (
        <div className="w-full h-full ">
            <Lottie animationData={Loader} />
        </div>
    );
}

export default Loading;