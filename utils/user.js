const users = [];

// Join user to chat : 
function joinUser(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

// Get the current user : 
function getCurrentUser(id){
    users.forEach((user) => {
        if(user.id == id){
            return user;
        }
    })
}

// User leavs the chat : 
function userLeave(id){
    const index = users.findIndex(user => user.id === id)
    if(!index != -1){
        return users.splice(index,1)[0];
    }
}

// Get room users : 
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}
module.exports = {
    users,
    joinUser,
    getCurrentUser,
    userLeave,
    getRoomUsers
}