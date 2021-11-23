import React, {useState, useEffect} from 'react';

const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const peerConnection = new RTCPeerConnection(configuration);

function WebrtcConnection() {
    const [message, setMessage] = useState('no messages yet');
    const [remoteMessage, setRemoteMessage] = useState('No Messages yet')

    const createOffer = async () => {
        console.log('first button');
        peerConnection.createOffer().then((desc)=>{
            peerConnection.setLocalDescription(desc);
            const newOffer = JSON.stringify(desc);
            document.getElementById('offer').innerHTML= newOffer;
            console.log(newOffer);

            document.getElementById("button1").onclick = async () =>{
                console.log('2ndbutton');
                const answer = (document.getElementById("input1").value);
                console.log(answer);
                const remoteDesc = new RTCSessionDescription(JSON.parse(answer));
                peerConnection.setRemoteDescription(remoteDesc);
                console.log(answer);
            }
        });
    }

    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            console.log("connected");
            document.getElementById('status').innerHTML = "Connected";
        }
    });

    //create dataChannel
    const dataChannel = peerConnection.createDataChannel("channel");

    //console log received message
    peerConnection.addEventListener('datachannel', event => {
        peerConnection.dataChannel = event.channel;

        peerConnection.dataChannel.addEventListener('message', event => {
            const newMessage = event.data;
            setRemoteMessage(newMessage);
        });
    });

    const sendMessage = async () => {
        console.log(message);
        dataChannel.send(message);
    }

    return (
        <div>
            <h1 style={{color: 'red'}}>WebRTC Example for Browser</h1>
            <h1>Generate Offer</h1>
            <p id='offer'>No Offer yet</p>
            <button onClick = {createOffer}>Create Offer</button>
            <h1>Enter your Answer below </h1>
            <form>
                <label>Answer: </label>
                <input id='input1' type='text'/>
            </form>
            <h3 id='status' style={{color: 'red'}}>No Connection Yet</h3>
            <button id='button1'>Connect</button>
            <div>
            <h1>New Messages from Remote</h1>
            <p>{remoteMessage}</p>
            <h1>Send Messages to Remote: </h1>
                <form>
                    <input id='sendMessage' type='text' onChange={e => setMessage(e.target.value)}></input>
                </form>
            </div>

            <button onClick={sendMessage}>Send Message</button>
        </div>
    )
}

export default WebrtcConnection
