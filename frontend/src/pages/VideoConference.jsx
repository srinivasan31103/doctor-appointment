import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from '../context/AuthContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  MessageSquare,
  Download,
  Users,
  Maximize,
  Minimize,
  Circle,
  StopCircle,
} from 'lucide-react';

const VideoConference = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Refs
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // State
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [remoteUserName, setRemoteUserName] = useState('');

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error('Failed to get media:', err);
        alert('Please allow camera and microphone access to join the call');
      });

    // Join room
    socketRef.current.emit('room:join', {
      roomId,
      userId: user._id,
      userName: user.name,
      role: user.role,
    });

    // Listen for room state
    socketRef.current.on('room:state', ({ participants: roomParticipants, messages: roomMessages }) => {
      setParticipants(roomParticipants);
      setMessages(roomMessages);
    });

    // Listen for user joined
    socketRef.current.on('user:joined', ({ userId, userName, role, socketId }) => {
      setParticipants((prev) => [...prev, { userId, userName, role, socketId }]);
      setRemoteUserName(userName);
    });

    // Listen for incoming call
    socketRef.current.on('call:incoming', ({ signal, from }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    // Listen for chat messages
    socketRef.current.on('chat:message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user left
    socketRef.current.on('user:left', ({ socketId }) => {
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      setCallAccepted(false);
      setCallEnded(true);
    });

    // Listen for screen sharing
    socketRef.current.on('screen:started', ({ userName }) => {
      alert(`${userName} started screen sharing`);
    });

    socketRef.current.on('screen:stopped', () => {
      alert('Screen sharing stopped');
    });

    // Listen for recording events
    socketRef.current.on('recording:started', ({ userName }) => {
      alert(`${userName} started recording the call`);
    });

    socketRef.current.on('recording:stopped', () => {
      alert('Recording stopped');
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.emit('room:leave', { roomId, userId: user._id });
        socketRef.current.disconnect();
      }
    };
  }, [roomId, user]);

  // Auto-call when another user joins
  useEffect(() => {
    if (participants.length > 0 && !callAccepted && !receivingCall) {
      callUser(participants[0].socketId);
    }
  }, [participants]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('call:initiate', {
        to: id,
        signal,
        from: socketRef.current.id,
      });
    });

    peer.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socketRef.current.on('call:accepted', ({ signal }) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('call:accept', { to: caller, signal });
    });

    peer.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socketRef.current.emit('room:leave', { roomId, userId: user._id });
    navigate(-1);
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      socketRef.current.emit('call:mute', { roomId, isMuted: !audioTrack.enabled });
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
      socketRef.current.emit('call:video-toggle', { roomId, isVideoOff: !videoTrack.enabled });
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        const videoTrack = screenStream.getVideoTracks()[0];

        if (connectionRef.current) {
          const sender = connectionRef.current._pc
            .getSenders()
            .find((s) => s.track.kind === 'video');
          sender.replaceTrack(videoTrack);
        }

        if (myVideo.current) {
          myVideo.current.srcObject = screenStream;
        }

        videoTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
        socketRef.current.emit('screen:start', { roomId, userName: user.name });
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    const videoTrack = stream.getVideoTracks()[0];

    if (connectionRef.current) {
      const sender = connectionRef.current._pc
        .getSenders()
        .find((s) => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);
    }

    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }

    setIsScreenSharing(false);
    socketRef.current.emit('screen:stop', { roomId });
  };

  const startRecording = () => {
    if (!stream) return;

    const options = { mimeType: 'video/webm; codecs=vp9' };
    recordedChunksRef.current = [];

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation-${roomId}-${new Date().getTime()}.webm`;
        a.click();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      socketRef.current.emit('recording:start', { roomId, userName: user.name });
    } catch (err) {
      console.error('Recording error:', err);
      alert('Recording not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      socketRef.current.emit('recording:stop', { roomId });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        roomId,
        message: newMessage,
        userName: user.name,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.emit('chat:message', message);
      setNewMessage('');
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Virtual Consultation</h1>
            <p className="text-gray-400 text-sm">Room: {roomId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{participants.length + 1} participants</span>
            </div>
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-500 animate-pulse">
                <Circle className="h-4 w-4 fill-current" />
                <span>Recording...</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* My Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
              <span className="text-sm">{user.name} (You)</span>
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <VideoOff className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            {callAccepted && !callEnded ? (
              <>
                <video
                  ref={userVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
                  <span className="text-sm">{remoteUserName || 'Remote User'}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {receivingCall && !callAccepted
                      ? 'Incoming call...'
                      : 'Waiting for other participant...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-6 w-6" />
            ) : (
              <Monitor className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <StopCircle className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors relative"
            title="Toggle chat"
          >
            <MessageSquare className="h-6 w-6" />
            {messages.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </button>

          <button
            onClick={leaveCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            title="End call"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold mb-4">Chat</h3>
            <div className="h-64 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    msg.userName === user.name ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
                  } max-w-xs`}
                >
                  <p className="text-xs font-semibold">{msg.userName}</p>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Incoming Call Modal */}
        {receivingCall && !callAccepted && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Incoming Call</h2>
              <p className="text-gray-400 mb-6">Someone is calling you...</p>
              <div className="flex space-x-4">
                <button
                  onClick={answerCall}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
                >
                  Accept
                </button>
                <button
                  onClick={() => setReceivingCall(false)}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConference;
