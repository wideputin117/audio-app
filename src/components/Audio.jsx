// component for recording audio

import { useState, useRef } from "react";
import { Button, Card} from "@material-tailwind/react";

const AudioRecorder = () =>{
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] =useState(null);
    
    // mimetype
    const mimeType = 'audio/webm';

    // to get the permission for audio
    const getMicrophonePermission = async ()=>{
        if('MediaRecorder' in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true); // sets the permission to true
                setStream(streamData); // sets the data from recording

            }catch(error){
                alert(error.message);
            }
        }
            else{
                alert("The Media is not supported in your browser")
            }

    } 
    
    // function to start recording
    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      };
      // to stop the recording
      const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
          //creates a blob file from the audiochunks data
           const audioBlob = new Blob(audioChunks, { type: mimeType });
          //creates a playable URL from the blob file.
           const audioUrl = URL.createObjectURL(audioBlob);
           setAudio(audioUrl);
           setAudioChunks([]);
        };
      };
    return (
        <section className="background"> 
         <div className="audio-controls background h-screen">
            <div className="mt-10 border-spacing-1 w-fit m-auto">
                <h1 className="font-bold text-center text-6xl">Audio Recorder</h1>
            </div>
      <Card className="w-96 ml-auto mr-auto mt-20"> 
             {!permission ? (
            <Button onClick={getMicrophonePermission} type="button">
                Get Microphone
            </Button>) : null}

            {permission && recordingStatus === "inactive" ? (
            <Button onClick={startRecording} type="button">
                Start Recording
            </Button>
              ) : null}
            {recordingStatus === "recording" ? (
            <Button onClick={stopRecording} type="button">
                Stop Recording
            </Button>
              ) : null}

        {audio ? (
            <div className="audio-container border-double p-l-10">
              <audio src={audio} controls='true'></audio>
                <a download href={audio}>
                    Download Recording
                </a>
            </div>
             ) : null}
          </Card>
        </div>
    </section>
     
    )

}


export default AudioRecorder;