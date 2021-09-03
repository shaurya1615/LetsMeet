const socket = io("/");
const videoGrid = document.getElementById('video-grid')


let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: 443
});


navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream
  addVideoStream(myVideo, stream)

  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
  })

  let text = $("input")
  $("html").keydown((e) =>{
    if(e.which == 13 && text.val().length !== 0){
      // console.log(text.val());
      socket.emit("message", text.val());
      text.val("")
    }
  })

  socket.on('createMessage', message => {
    $('.messages').append(`<li class='message'> <b><span class="message_user">user</span></b><br> ${message} </li>`)
    scrollToBottom()
    // console.log(message);
  })

})

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}


function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}

function scrollToBottom() {
  var d = $(".main__chat_window")
  d.scrollTop(d.prop("scrollHeight"))
}

function muteUnmute() {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false
    setUnmuteButton()
  }
  else{
    myVideoStream.getAudioTracks()[0].enabled =  true
    setMuteButton()
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="stop fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}


function playStop() {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false
    setPauseButton()
  }
  else{
    myVideoStream.getVideoTracks()[0].enabled =  true
    setPlayButton()
  }
}

const setPlayButton = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPauseButton = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

// function hideChat() {
//   var element_main = document.getElementsByClassName("main__right_collapse");
//   element_main[0].classList.toggle("main__right");
// }
