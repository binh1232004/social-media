// // import SignIn from "./signin/page";
// // import HomePage from "./home/page";
// // export default function Home() {
// //   return (
// //     // <div>
// //     //     <h1 className="text-white">
// //     //         Đang tiến hàng bảo trì và phát triển 
// //     //     </h1>
// //     // </div>
// //     <div>
// //       <h1>teest ci/cd</h1>
// //       <HomePage/>

// //     </div>
   
// //   );
// // }
"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState([]);

  const [currentID, setCurrentID] = useState(""); 
  const [targetID, setTargetID] = useState(""); 
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    const onReceiveMsg = (msg) => {
      console.log('Receive msg');
      setMessage(prev => [...prev, msg]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMsg", onReceiveMsg)
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMsg", onReceiveMsg)
    };
  }, []);
  useEffect(() => {
    console.log(message)
  }, [message])
  const handleCurrentId = (e) => {  
    e.preventDefault();
    console.log("Emitting ID:", currentID); // Add this log
    socket.emit('register', {currentID, targetID});
  }
  const handleChat = (e) => {
    e.preventDefault();
    console.log(inputValue);
    socket.emit("chat", inputValue);
    setInputValue("");
  }
  return (
    <div>
      <form className="flex flex-row">
        
        <input type="text" className="w-4/5 border-4 border-green-400" value={currentID} onChange={(e) => setCurrentID(e.target.value)}></input>
        <input type="text" className="w-4/5 border-4 border-red-500" value={targetID} onChange={(e) => setTargetID(e.target.value)}></input>
        <button className="w-1/5 p-4 bg-green-200  border-black"  onClick={handleCurrentId}>Emit to server current id</button>
        
      </form>
      <form className="flex flex-row">
 
        <input type="text" className="w-4/5 border-black" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input>
        <button className="w-1/5 p-4 bg-green-200  border-black" onClick={handleChat} >chat</button>
      </form>
        <ul>{
          message.map((item, index) => ( 
            <li className="bg-slate-100 text-yellow">{item}</li>
           ))
          
        }</ul>
    </div>
  );
}

