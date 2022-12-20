let username 
let socket = io()
do{
    username = prompt('Enter your name ')
}
while(!username)

const textarea = document.querySelector('#textarea');
const submitBtn = document.querySelector('#submitBtn');

const commentBox = document.querySelector('.comment__box');
submitBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    let comment = textarea.value
    if(!comment){
        return
    }
    postComment(comment);
})

function postComment(comment){
    //Append to DOM
    let data ={
        username : username,
        comment: comment
    }
    appendToDom(data);
    textarea.value =''
    //Broadcast
    broadcastComment(data)
    // Sync with MongoDB
    syncWithDb(data);
}

function appendToDom(data){
    let lTag = document.createElement('li');
    lTag.classList.add('comment','mb-3');
    let markup =  `
        <div class="card border-light mb-3">
            <div class="card-body">
                    <h5>${data.username}</h5>
                    <p>${data.comment}</p>
                    <div>
                        <i class="fa-solid fa-clock"></i>
                        <small>${moment(data.time).format('LT')}</small>
                    </div>
            </div>
        </div>
    `
    lTag.innerHTML = markup;
    commentBox.prepend(lTag)

}

function broadcastComment (data){
    //Socket
    socket.emit('comment', data)
}
socket.on('comment',(data)=>{
    appendToDom(data)    
})

let timerId = null;
function debounce(func, timer){
    if(timerId){
        clearTimeout(timerId);
    }
    timerId = setTimeout(()=>{
        func();
    }, timer)
}

let typingDiv = document.querySelector('.typing')
socket.on('typing',(data)=>{
    typingDiv.innerText = `${data.username} is typing...`;
    debounce(function(){
        typingDiv.innerText = '';
    },1000);
})

//Event Listner on textarea
textarea.addEventListener('keyup',()=>{
    socket.emit('typing',{username})
})

//API calls
function syncWithDb(data){
    const headers ={
        'Content-Type': 'application/json'
    }
    fetch('/api/comments',{ method: 'Post', body: JSON.stringify(data), headers})
        .then(response =>response.json())
        .then(result=>{
            console.log(result)   
        })
}
function fetchComments(){
    fetch('/api/comments')
        .then(res=> res.json())
        .then(result=>{
            result.forEach((comment)=>{
                comment.time = comment.createdAt
                appendToDom(comment)
            })

            console.log(result)
        })
}

window.onload = fetchComments