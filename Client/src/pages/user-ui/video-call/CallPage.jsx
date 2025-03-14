import React, { useEffect } from 'react'
import VideoCallUI from '../../../components/user/video-call/VideoCallUI'
import { useLocation } from 'react-router-dom';

function CallPage() {
    const location = useLocation();
    const isCaller = location.state?.isCaller || false;

    return (
        <div>
            <VideoCallUI isCaller={isCaller} />
        </div>
    )
}

export default CallPage