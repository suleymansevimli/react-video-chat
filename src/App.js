import Peer from 'peerjs';
import './App.css';
import useSocket from "./hooks/useSocket";
import {useEffect} from "react";

function App() {

    const socket = useSocket(process.env.SOCKET_URL)

    const ROOM_ID = '12345';

    useEffect(() => {
        if (!socket) return;

        const myPeer = new Peer(undefined, {
            host: '/', // must be https url
            port: process.env.PEER_PORT || 3001, // port number must be 443
        //  secure: true  // for ` https:// `
        });

        const peers = {}

        const myVideo = document.createElement('video');
        myVideo.muted = true;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {

            addVideoStream(myVideo, stream)

            myPeer.on('call', call => {
                call.answer(stream)

                const video = document.createElement('video');
                video.muted = true;

                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })
            })

            socket.on('user-connected', (userId) => {
                connectToNewUser(userId, stream)
            })
        })


        function addVideoStream(video, stream) {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play()
            })
            document.getElementById('video-grid').append(video)
        }

        function connectToNewUser(userId, stream) {
            const call = myPeer.call(userId, stream);
            const video = document.createElement('video');
            video.muted = true;

            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })

            call.on('close', () => {
                video.remove()
            })

            peers[userId] = call;

        }

        myPeer.on('open', id => {
            socket.emit('join-room', ROOM_ID, id)
        })

        socket.on('user-disconnected', userId => {

        })

    }, [socket])

    return (
        <div className="App" id={'video-grid'}>

        </div>
    );
}

export default App;
