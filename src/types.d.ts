interface Window {
    webkitAudioContext: typeof AudioContext;
    mozAudioContext: typeof AudioContext;
    msAudioContext: typeof AudioContext;
    webkitRequestAnimationFrame: typeof requestAnimationFrame;
    mozRequestAnimationFrame: typeof requestAnimationFrame;
    msRequestAnimationFrame: typeof requestAnimationFrame;
    webkitCancelAnimationFrame: typeof cancelAnimationFrame;
    mozCancelAnimationFrame: typeof cancelAnimationFrame;
    msCancelAnimationFrame: typeof cancelAnimationFrame;
}