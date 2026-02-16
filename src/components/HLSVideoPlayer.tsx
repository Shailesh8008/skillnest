import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface HLSVideoPlayerProps {
  videoUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<HLSVideoPlayerProps> = ({
  videoUrl,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Quality & Speed
  const [qualities, setQualities] = useState<
    { height: number; level: number }[]
  >([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = Auto
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeMenu, setActiveMenu] = useState<"main" | "quality" | "speed">(
    "main",
  );
  const [playingLevel, setPlayingLevel] = useState(-1);
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  const [previewLeft, setPreviewLeft] = useState(0);
  const [isVolumeChanged, setIsVolumeChanged] = useState(false);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hlsRef = useRef<Hls | null>(null);

  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFallback = () => {
      if (!video.src.endsWith("error-video.mp4")) {
        console.warn("Video failed to load, switching to fallback.");
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        video.src = "/videos/error-video.mp4";
      }
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const allowedHeights = [144, 240, 360, 480, 720, 1080, 1440, 2160];
        const levels = data.levels
          .map((level, index) => ({
            height: level.height,
            level: index,
          }))
          .filter((level) => allowedHeights.includes(level.height));
        setQualities(levels);
        setIsLoading(false);
        if (isPlaying) video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setPlayingLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          handleFallback();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    } else {
      handleFallback();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoUrl]);

  // Event Listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // Controls Visibility
  const showControls = () => {
    setIsHovering(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setIsHovering(false);
      setShowSettings(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    showControls();
  };

  const handleMouseLeave = () => {
    if (isPlaying && !showSettings) {
      setIsHovering(false);
    }
  };

  // Actions
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const time = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changeQuality = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentQuality(level);
      setShowSettings(false);
      setActiveMenu("main");
    }
  };

  const changeSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
    setActiveMenu("main");
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const time = (percentage / 100) * duration;
    setPreviewTime(time);
    setPreviewLeft(x);
  };

  const handleTimelineMouseLeave = () => {
    setPreviewTime(null);
  };

  // Volume visibility helper
  const showVolumeSlider = () => {
    setIsVolumeChanged(true);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => {
      setIsVolumeChanged(false);
    }, 2000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          if (video.paused) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
          showControls();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen({ stopPropagation: () => {} } as React.MouseEvent);
          break;
        case "m":
          e.preventDefault();
          toggleMute({ stopPropagation: () => {} } as React.MouseEvent);
          showControls();
          showVolumeSlider();
          break;
        case "arrowleft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          showControls();
          break;
        case "arrowright":
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 5);
          showControls();
          break;
        case "arrowup":
          e.preventDefault();
          const newVolUp = Math.min(1, video.volume + 0.1);
          video.volume = newVolUp;
          setVolume(newVolUp);
          setIsMuted(newVolUp === 0);
          showControls();
          showVolumeSlider();
          break;
        case "arrowdown":
          e.preventDefault();
          const newVolDown = Math.max(0, video.volume - 0.1);
          video.volume = newVolDown;
          setVolume(newVolDown);
          setIsMuted(newVolDown === 0);
          showControls();
          showVolumeSlider();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleFullscreen, toggleMute]);

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black overflow-hidden rounded-xl ${className} ${isPlaying && !isHovering ? "cursor-none" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className={`w-full h-full object-contain ${isPlaying && !isHovering ? "cursor-none" : "cursor-default"}`}
        onClick={togglePlay}
        poster="/placeholder-video.jpg" // Optional poster
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Play/Pause Center Overlay (Optional) */}
      {!isPlaying && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
          onClick={togglePlay}
        >
          <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm">
            <Play className="w-12 h-12 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-4 transition-opacity duration-300 ${isHovering || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Bar */}
        <div
          className="relative group/progress h-2 w-full bg-white/30 rounded-full cursor-pointer mb-4"
          onMouseMove={handleTimelineMouseMove}
          onMouseLeave={handleTimelineMouseLeave}
        >
          {/* Preview Tooltip */}
          {previewTime !== null && (
            <div
              className="absolute bottom-4 -translate-x-1/2 bg-black/90 border border-white/20 rounded text-white text-xs py-1 px-2 font-mono shadow-xl pointer-events-none z-20"
              style={{ left: previewLeft }}
            >
              {formatTime(previewTime || 0)}
            </div>
          )}

          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="h-full bg-indigo-500 rounded-full relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white" />
              )}
            </button>

            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-white hover:text-indigo-400 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className={`w-0 overflow-hidden transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white ${
                  isVolumeChanged ? "w-24" : "group-hover/volume:w-24"
                }`}
              />
            </div>

            <div className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Settings Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setActiveMenu("main");
                }}
                className={`text-white hover:text-indigo-400 transition-colors relative`}
              >
                <Settings
                  className={`w-6 h-6 transform duration-300 ${showSettings ? "rotate-45" : ""}`}
                />
                {(() => {
                  const currentHeight =
                    playingLevel !== -1
                      ? qualities.find((q) => q.level === playingLevel)?.height
                      : null;

                  let label = null;
                  if (currentHeight != null) {
                    if (currentHeight >= 2160) label = "4K";
                    else if (currentHeight >= 1440) label = "QHD";
                    else if (currentHeight >= 1080) label = "FHD";
                    else if (currentHeight >= 720) label = "HD";
                  }

                  if (!label) return null;

                  return (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold px-1 rounded-sm shadow-sm scale-75 origin-bottom-left">
                      {label}
                    </span>
                  );
                })()}
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-10 right-0 bg-black/90 backdrop-blur-md rounded-lg overflow-hidden w-64 shadow-xl border border-white/10 text-white text-sm z-50">
                  {activeMenu === "main" && (
                    <div className="p-2">
                      <button
                        onClick={() => setActiveMenu("quality")}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                      >
                        <span className="flex items-center gap-2">Quality</span>
                        <span className="flex items-center text-xs text-gray-400">
                          {currentQuality === -1
                            ? "Auto"
                            : `${qualities.find((q) => q.level === currentQuality)?.height}p`}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveMenu("speed")}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                      >
                        <span className="flex items-center gap-2">Speed</span>
                        <span className="flex items-center text-xs text-gray-400">
                          {playbackSpeed}x
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </button>
                    </div>
                  )}

                  {activeMenu === "quality" && (
                    <div className="p-2">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 mb-2 font-semibold">
                        <button
                          onClick={() => setActiveMenu("main")}
                          className="hover:text-indigo-400"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        Quality
                      </div>
                      <button
                        onClick={() => changeQuality(-1)}
                        className={`w-full text-left px-8 py-2 hover:bg-white/10 rounded-md transition-colors relative ${currentQuality === -1 ? "text-indigo-400" : ""}`}
                      >
                        {currentQuality === -1 && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">
                            ✓
                          </span>
                        )}
                        Auto
                      </button>
                      {qualities.map((q) => (
                        <button
                          key={q.level}
                          onClick={() => changeQuality(q.level)}
                          className={`w-full text-left px-8 py-2 hover:bg-white/10 rounded-md transition-colors relative ${currentQuality === q.level ? "text-indigo-400" : ""}`}
                        >
                          {currentQuality === q.level && (
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">
                              ✓
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            {q.height}p
                            {q.height === 720 && (
                              <span className="text-[10px] px-1 bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30">
                                HD
                              </span>
                            )}
                            {q.height === 1080 && (
                              <span className="text-[10px] px-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                                FHD
                              </span>
                            )}
                            {q.height === 1440 && (
                              <span className="text-[10px] px-1 bg-pink-500/20 text-pink-400 rounded border border-pink-500/30">
                                QHD
                              </span>
                            )}
                            {q.height === 2160 && (
                              <span className="text-[10px] px-1 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                                4K
                              </span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {activeMenu === "speed" && (
                    <div className="p-2">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 mb-2 font-semibold">
                        <button
                          onClick={() => setActiveMenu("main")}
                          className="hover:text-indigo-400"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        Playback Speed
                      </div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`w-full text-left px-8 py-2 hover:bg-white/10 rounded-md transition-colors relative ${playbackSpeed === speed ? "text-indigo-400" : ""}`}
                        >
                          {playbackSpeed === speed && (
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">
                              ✓
                            </span>
                          )}
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
