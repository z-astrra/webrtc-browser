import React, {useState, useEffect} from 'react';

function WebrtcConnection() {
    const [description2, setDescription2] = useState(''); //remote description

    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);


    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            console.log("connected")
        }
    });

    //create dataChannel
    const dataChannel = peerConnection.createDataChannel("channel");

    //console log received message
    peerConnection.addEventListener('datachannel', event => {
        peerConnection.dataChannel = event.channel;

        peerConnection.dataChannel.addEventListener('message', event => {
        console.log(event.data);
    });
    });

    const createOffer = async () => {
        console.log('first button');
        peerConnection.createOffer().then((desc)=>{
            peerConnection.setLocalDescription(desc);
            console.log(JSON.stringify(desc));
            document.getElementById("button1").onclick = async () =>{
                console.log('2ndbutton');
                const answer = (document.getElementById("input1").value);
                const remoteDesc = new RTCSessionDescription(JSON.parse(answer));
                peerConnection.setRemoteDescription(remoteDesc);
                console.log(answer);
            }
        });
    }
        useEffect(()=>{
            document.getElementById('input1').onchange = e => {
                const answer = (e.target.value);
                setDescription2(answer);
                // console.log(description2);
            }
        })

    return (
        <div>
            <h1 style={headerStyle}>WebRTC Example for Browser</h1>
            <h1>Generate Offer</h1>
            <p></p>
            <button onClick = {createOffer}>Create Offer</button>
            <h1>Enter your Answer below </h1>
            <form>
                <label>Answer: </label>
                <input id='input1' onChange ={e => {setDescription2(e.target.value)}}/>
            </form>

            <button id='button1'>Connect</button>
        </div>
    )
}

const headerStyle = {
    color: 'red',

}

export default WebrtcConnection
