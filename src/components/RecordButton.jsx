import { useEffect, useState } from 'react'
import getDateTime from '../functions/getDateTime'
import "./RecordButton.css"

export default function RecordButton() {
    const [recording, setRecording] = useState();
    const [media, setMedia] = useState();
    const type = recording ? "stop-button" : "record-button";

    async function startRecording() {
        try {
            const displayMedia = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 60 } },
                audio: true,
                systemAudio: "include"
            })
            const mediaRecorder = new MediaRecorder(displayMedia, {
                mimeType: 'video/webm;codecs=h264,opus'
            })
            
            mediaRecorder.start()
            setMedia([displayMedia, mediaRecorder])

            const [video] = displayMedia.getVideoTracks()
                video.addEventListener("ended", () => {
                mediaRecorder.stop()
                setRecording(false)
                setMedia(null)
            })
            
            mediaRecorder.addEventListener("dataavailable", (e) => {
                const a = document.createElement("a")
                a.href = URL.createObjectURL(e.data)
                a.download = "snapkeep-record-" + getDateTime() + ".webm"
                a.click()
            })
        } catch (e) {
            console.log(e)
            stopRecording()
            setRecording(false)
        }
    }

    function stopRecording() {
        if (media) {
            const [displayMedia, mediaRecorder] = media
            mediaRecorder.stop()
            displayMedia.getVideoTracks().forEach(track => track.stop())
            setMedia(null)
        }
    }

    useEffect(
        () => {
            if (recording) {
                startRecording()
            } else if (recording == false) {
                stopRecording()
            }
        },
        [recording]
    )
    function record() {
        setRecording(!recording);
    }

    return(
        <button className={type} onClick={record}>
            {
                recording ? "STOP" : "RECORD" 
            }
        </button>
    )

}