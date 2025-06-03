import React, { useEffect } from 'react';
import { initializeBoidsAnimation } from '../BoidsAnimation';

const FrontPage: React.FC = () => {
    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas) {
            initializeBoidsAnimation(canvas);
        }
    }, []);

    return (
        <div>
            <canvas id="canvas" style={{ width: '100%', height: '100vh' }}></canvas>
            <h1>Welcome to the Front Page</h1>
        </div>
    );
};

export default FrontPage;