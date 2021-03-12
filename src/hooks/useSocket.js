import {useEffect, useState} from "react";
import {io} from "socket.io-client";

export default function useSocket(uri, cb) {
    const [activeSocket, setActiveSocket] = useState(null);

    const socket = io(uri);

    useEffect(() => {
        if (activeSocket || !socket) return;
        cb && cb(socket);
        setActiveSocket(socket);
        return function cleanup() {
            socket.off("message.chat1", cb);
        };
    }, []);

    return activeSocket;
}