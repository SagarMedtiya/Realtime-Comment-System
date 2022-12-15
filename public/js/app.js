


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