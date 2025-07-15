import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10"
// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for legal values for client and os

testSupport([
    { client: 'Chrome' },
])

function testSupport(supportedDevices) {
    const deviceDetector = new DeviceDetector()
    const detectedDevice = deviceDetector.parse(navigator.userAgent)
    let isSupported = false
    for (const device of supportedDevices) {
        if (device.client !== undefined) {
            const re = new RegExp(`^${device.client}$`)
            if (!re.test(detectedDevice.client.name)) {
                continue
            }
        }
        if (device.os !== undefined) {
            const re = new RegExp(`^${device.os}$`)
            if (!re.test(detectedDevice.os.name)) {
                continue
            }
        }
        isSupported = true
        break
    }
    if (!isSupported) {
        alert(`This demo, running on ${detectedDevice.client.name}/${detectedDevice.os.name}, ` +
            `is not well supported at this time, continue at your own risk.`)
    }
}

const controls = window
const mpHolistic = window
const drawingUtils = window
const config = { locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@` + `${mpHolistic.VERSION}/${file}`
    }}
const videoElement = document.getElementsByClassName('input_video')[0]
const canvasElement = document.getElementsByClassName('output_canvas')[0]
const controlsElement = document.getElementsByClassName('control-panel')[0]
const canvasCtx = canvasElement.getContext('2d')
const fpsControl = new controls.FPS()
// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading')

spinner.ontransitionend = () => {
    spinner.remove()
}

// Function for manage landmark
function removeElements(landmarks, elements) {
    for (const element of elements) {
        delete landmarks[element]
    }
}
function removeLandmarks(results) {
    if (results.poseLandmarks) {
        removeElements(
            results.poseLandmarks,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]
        )
    }
}
function connect(ctx, connectors) {
    const canvas = ctx.canvas
    for (const connector of connectors) {
        const from = connector[0]
        const to = connector[1]
        if (from && to) {
            if (from.visibility && to.visibility && (from.visibility < 0.1 || to.visibility < 0.1)) {
                continue
            }
            ctx.beginPath()
            ctx.moveTo(from.x * canvas.width, from.y * canvas.height)
            ctx.lineTo(to.x * canvas.width, to.y * canvas.height)
            ctx.stroke()
        }
    }
}

var JSZip = require("jszip");
let zip = new JSZip();
let activeEffect = 'mask'
let COLO = {
    "Connect" : "rgb(0, 225, 0)",
    "Left" : "rgb(255, 138, 0)",
    "Right" : "rgb(0, 238, 255)",
    "Lib" : "rgb(231, 45, 67)"
}
let btnCOL = {
    "disable" : "#aeaeae",
    "on" : "#7ce456",
    "off" : "#ee5a52"
}

// Gobal variable
let record = 'Off'
let isRecording = false;
let iterFile = 0
let iterFolder = 0
let poseName = ''
let boneSwitch = true
const folderRec = 30
const fileRec = 30
const waitStart = 5
const waitBet = 3
// const folderRec = 2
// const fileRec = 10
// const waitStart = 1
// const waitBet = 1


const record_btn = document.getElementById('record')
const stop_btn = document.getElementById('stop')
const bone_btn = document.getElementById('bone')
const show_FileRec = document.getElementById('fileRec')
const show_FrameRec = document.getElementById('frameRec')

// This will called in onResults()
function waitBetween(fol) {
    let down = waitBet
    if (fol == folderRec) {
        stop_btn.disabled = true
        stop_btn.style.backgroundColor = btnCOL['disable']
        record_btn.value = `Finished`
        isRecording = false
        setTimeout(() => {
            stop_btn.disabled = false
            stop_btn.style.backgroundColor = btnCOL['off']
            record = 'On'
        }, 1000);
    }else {
        stop_btn.disabled = true
        stop_btn.style.backgroundColor = btnCOL['disable']
        record_btn.value = `Wait(${down--})`
        let waitCountdown = setInterval(() => {
            if (down == 0) {
                stop_btn.disabled = false
                stop_btn.style.backgroundColor = btnCOL['off']
                record_btn.value = "Started"
                record = 'On'
                clearInterval(waitCountdown)
            }else {
                record_btn.value = `Wait(${down--})`
            }
        }, 1000);
    }
}

record_btn.addEventListener('click', () => {
    if (isRecording) return;
    isRecording = true;
    
    zip = new JSZip();
    poseName = prompt('Enter name for this pose');
    poseName = (poseName === '' || poseName === null ? `NewPose${document.querySelector('.file-list').childElementCount + 1}` : poseName);

    let countdown = waitStart;
    let btn_Countdown = setInterval(() => {
        if (countdown === 0) {
            record_btn.value = `Started`;
            record_btn.disabled = true;
            record_btn.style.backgroundColor = btnCOL['disable'];
            stop_btn.style.backgroundColor = btnCOL['off'];
            stop_btn.disabled = false;
            record = 'On';
            clearInterval(btn_Countdown);
        } else {
            record_btn.value = `Wait(${countdown--})`;
        }
    }, 1000);
});

stop_btn.addEventListener('click', () => {
    record = 'Reset'
    isRecording = false
    record_btn.value = "Start"
    record_btn.disabled = false
    record_btn.style.backgroundColor = btnCOL['on']
    stop_btn.style.backgroundColor = btnCOL['disable']
    stop_btn.disabled = true
})
bone_btn.addEventListener('click', () => {
    if (!boneSwitch) {
        boneSwitch = true
        bone_btn.style.backgroundColor = btnCOL['on']
    }else {
        boneSwitch = false
        bone_btn.style.backgroundColor = btnCOL['off'] 
    }
})

// Main function
async function onResults(results) {
    document.body.classList.add('loaded') // Hide the spinner.
    record_btn.disabled = false
    removeLandmarks(results)
    fpsControl.tick() // Update the frame rate.
    
    // Set x, y, z to 0 and stop canvas to generate landpoint when that part not showing up
    let isVisible = {
        'leftHand' : true,
        'rightHand' : true,
        'face' : true,
        'pose' : true,
    }
    if (!('leftHandLandmarks' in results)) {
        results['leftHandLandmarks'] = new Array(21).fill({'x':0, 'y':0, 'z':0, 'visibility':0})
        isVisible['leftHand'] = false
    }
    if (!('rightHandLandmarks' in results)) {
        results['rightHandLandmarks'] = new Array(21).fill({'x':0, 'y':0, 'z':0, 'visibility':0})
        isVisible['rightHand'] = false
    }
    if (!('faceLandmarks' in results)) {
        results['faceLandmarks'] = new Array(468).fill({'x':0, 'y':0, 'z':0, 'visibility':0})
        isVisible['face'] = false
    }
    // There are 33 array of pose but 19 is empty
    if (!('poseLandmarks' in results)) {
        results['poseLandmarks'] = new Array(14).fill({'x':0, 'y':0, 'z':0, 'visibility':0})
        isVisible['pose'] = false
    }

    let land_data = []
    let landMarkList = [
        'leftHandLandmarks',
        'rightHandLandmarks',
        'faceLandmarks',
        'poseLandmarks'
    ]

    // Collect position of landpoints and return the value
    landMarkList.forEach(land => {
        results[land].forEach(element => {
            for (const [keys, value] of Object.entries(element)) {
                value != undefined ? land_data.push(value) : land_data.push(0)
            }
        });
    });

    // Draw the overlays.
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
    if (results.segmentationMask) {
        canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height)
        // Only overwrite existing pixels.
        if (activeEffect === 'mask' || activeEffect === 'both') {
            canvasCtx.globalCompositeOperation = 'source-in'
            // This can be a color or a texture or whatever...
            canvasCtx.fillStyle = '#00FF007F'
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)
        }
        else {
            canvasCtx.globalCompositeOperation = 'source-out'
            canvasCtx.fillStyle = '#0000FF7F'
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)
        }
        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop'
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)
        canvasCtx.globalCompositeOperation = 'source-over'
    }
    else {

        // const inputAspect = results.image.width / results.image.height
        // const canvasAspect = canvasElement.width / canvasElement.height
        // let sx = 0, sy = 0, sWidth = results.image.width, sHeight = results.image.height

        // if (inputAspect > canvasAspect) {
        //     // Crop if too width
        //     const newWidth = results.image.height * canvasAspect
        //     sx = (results.image.width - newWidth) / 2
        //     sWidth = newWidth
        // } else {
        //     // Crop if too height
        //     const newHeight = results.image.width / canvasAspect
        //     sy = (results.image.height - newHeight) / 2
        //     sHeight = newHeight
        // }

        // canvasCtx.drawImage(results.image, sx, sy, sWidth, sHeight, 0, 0, canvasElement.width, canvasElement.height)
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)
    }

    if (boneSwitch) {
        // Connect elbows to hands. Do this first so that the other graphics will draw on top of these marks.
        canvasCtx.lineWidth = 5
        if (isVisible['rightHand']) {
            canvasCtx.strokeStyle = COLO['Connect']
            connect(canvasCtx, [[
                    results.poseLandmarks[mpHolistic.POSE_LANDMARKS.RIGHT_ELBOW],
                    results.rightHandLandmarks[0]
                ]])
            // Hand section
            drawingUtils.drawConnectors(canvasCtx, results.rightHandLandmarks, mpHolistic.HAND_CONNECTIONS, {color: COLO['Connect']})
            drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
                color: COLO['Connect'],
                fillColor: COLO['Right'],
                lineWidth: 2,
                radius: (data) => {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1)
                }
            })
        }
        if (isVisible['leftHand']) {
            canvasCtx.strokeStyle = COLO['Connect']
            connect(canvasCtx, [[
                    results.poseLandmarks[mpHolistic.POSE_LANDMARKS.LEFT_ELBOW],
                    results.leftHandLandmarks[0]
                ]])
            // Hand section
            drawingUtils.drawConnectors(canvasCtx, results.leftHandLandmarks, mpHolistic.HAND_CONNECTIONS, {color: COLO['Connect']})
            drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
                color: COLO['Connect'],
                fillColor: COLO['Left'],
                lineWidth: 2,
                radius: (data) => {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1)
                }
            })
        }
        // Pose...
        if (isVisible['pose']) {
            drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpHolistic.POSE_CONNECTIONS, {color: COLO['Connect']})
            drawingUtils.drawLandmarks(canvasCtx, Object.values(
                mpHolistic.POSE_LANDMARKS_LEFT).map(
                    index => results.poseLandmarks[index]),
                    {visibilityMin: 0.65, color: COLO['Connect'], fillColor: COLO['Left']})
            drawingUtils.drawLandmarks(canvasCtx, Object.values(
                mpHolistic.POSE_LANDMARKS_RIGHT).map(
                    index => results.poseLandmarks[index]),
                    {visibilityMin: 0.65, color: COLO['Connect'], fillColor: COLO['Right']})
        }
        // Face...
        if (isVisible['face']) {
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 })
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYE, { color: COLO['Right'] })
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYEBROW, { color: COLO['Right'] })
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYE, { color: COLO['Left'] })
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYEBROW, { color: COLO['Left'] })
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_FACE_OVAL, { color: COLO['Connect'], lineWidth: 5 })
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LIPS, { color: COLO['Lib'], lineWidth: 5 })
        }
        canvasCtx.restore()
    }
    
    // Start recording if record variable are 'On'
    // Increse folder number when 'Flip'
    if (record == 'On') {
        show_FileRec.innerHTML = `&nbsp;${iterFolder}/${folderRec}`
        show_FrameRec.innerHTML = `&nbsp;${iterFile}/${fileRec}`
        if (iterFolder < folderRec) {
            if (iterFile < fileRec) {
                // Create zip file cantain with pose folder of frame with landmark position
                let currentData = land_data
                // let folder = zip.folder(iterFolder.toString());
                // let arrayBuffer = new TextEncoder().encode(JSON.stringify(currentData));
                // folder.file(`${iterFile++}.txt`, arrayBuffer);

                // Convert array to CSV string in JS
                const csvString = currentData.join(',') + '\n';
                let folder = zip.folder(iterFolder.toString());
                let arrayBuffer = new TextEncoder().encode(csvString);
                folder.file(`${iterFile++}.csv`, arrayBuffer);
            }else {
                record = 'Flip'
            }
        }else {
            // Create element inside
            let file_list = document.querySelector('.file-list')
            let group = document.createElement('div')
            let fileID = `file${file_list.childElementCount + 1}`
            let name = document.createElement('p')
            let btn_group = document.createElement('div')
            let btn1 = document.createElement('i')
            let btn2 = document.createElement('i')
            
            group.id = fileID
            group.classList.add('file-group')
            name.innerHTML = `${poseName}.rar`
            btn_group.classList.add('sub')
            // btn1.classList.add('download')
            btn1.classList.add('ph-fill')
            btn1.classList.add('ph-file-arrow-down')
            btn2.classList.add('ph-fill')
            btn2.classList.add('ph-trash')

            // Generate a file can take a long time so make it asynchronously
            let currentZip = zip;
            let currentPose = poseName;
            let content = await currentZip.generateAsync({ type: "blob" });

            btn1.addEventListener('click', () => {
                let link = document.createElement("a");
                link.href = URL.createObjectURL(content);
                link.download = `${currentPose}.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            btn2.addEventListener('click', (e) => {
                e.target.parentElement.parentElement.remove()
            })

            file_list.appendChild(group)
            group.appendChild(name)
            group.appendChild(btn_group)
            btn_group.appendChild(btn1)
            btn_group.appendChild(btn2)

            record = 'Reset'
        }
    }else if (record == 'Flip') {
        record = 'Off'
        iterFolder += 1
        iterFile = 0
        waitBetween(iterFolder)
    }else if (record == 'Reset') {
        stop_btn.click()
        iterFolder = 0
        iterFile = 0
        record = 'Off'
    }
}

const holistic = new mpHolistic.Holistic(config)
holistic.onResults(onResults)

// Present a control panel through which the user can manipulate the solution options.
new controls
    .ControlPanel(controlsElement, {
    selfieMode: true,
    modelComplexity: 0,
    smoothLandmarks: false,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    effect: 'background',
})
    .add([
    new controls.StaticText({ title: 'MediaPipe Holistic' }),
    fpsControl,
    new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
    new controls.SourcePicker({
        onSourceChanged: () => {
            // Resets because the pose gives better results when reset between source changes.
            holistic.reset()
        },
        onFrame: async (input, size) => {
            const aspect = size.height / size.width
            let width, height
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight
                width = height / aspect
            }
            else {
                width = window.innerWidth
                height = width * aspect
            }
            canvasElement.width = width
            canvasElement.height = height
            await holistic.send({ image: input })
        },
        // onFrame: async (input, size) => {
        //     // canvasElement.width = 720;
        //     // canvasElement.height = 960;
        //     canvasElement.width = 240;
        //     canvasElement.height = 320;
        //     await holistic.send({ image: input });
        // }
    }),
    new controls.Slider({
        title: 'Model Complexity',
        field: 'modelComplexity',
        discrete: ['Lite', 'Full', 'Heavy'],
    }),
    new controls.Toggle({ title: 'Smooth Landmarks', field: 'smoothLandmarks' }),
    new controls.Toggle({ title: 'Enable Segmentation', field: 'enableSegmentation' }),
    new controls.Toggle({ title: 'Smooth Segmentation', field: 'smoothSegmentation' }),
    new controls.Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
    }),
    new controls.Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
    }),
    new controls.Slider({
        title: 'Effect',
        field: 'effect',
        discrete: { 'background': 'Background', 'mask': 'Foreground' },
    }),
]).on(x => {
    const options = x
    videoElement.classList.toggle('selfie', options.selfieMode)
    activeEffect = x['effect']
    holistic.setOptions(options)
})