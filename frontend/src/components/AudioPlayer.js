import React, { useEffect, useRef } from 'react';

function AudioPlayer({ url, type }) {
    const audioRef = useRef(null);

    useEffect(() => {
        // Try getting saved time for this podcast URL
        const savedTime = localStorage.getItem(`podcast-${url}-time`);
        if (savedTime) {
            audioRef.current.currentTime = parseFloat(savedTime); // converting the saved string to a float
        }

        // Add event listener for pause to save current time
        audioRef.current.addEventListener('pause', saveCurrentTime);

        // Optionally, you can save every 10 seconds
        const interval = setInterval(saveCurrentTime, 10000); // 10 seconds

        return () => {
            // Cleanup listeners when the component unmounts
            audioRef.current.removeEventListener('pause', saveCurrentTime);
            clearInterval(interval);
        };
    }, [url]); // Depend on URL, so if the podcast changes, the effect reruns

    const saveCurrentTime = () => {
        localStorage.setItem(`podcast-${url}-time`, audioRef.current.currentTime.toString());
    }

    return (
        <audio ref={audioRef} controls>
            <source src={url} type={type} />
            Your browser does not support the audio element.
        </audio>
    );
}

export default AudioPlayer;
