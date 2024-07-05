require('dotenv').config();
const sql = require('mssql');




const { connectSQL } = require('./middlewares/db');


const  connect = require('./middlewares/db');




const app = require('express')();

app.use(async(req, res, next) => {
 await connectSQL().then(() => {
    next();
  });
});

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);




const userRoutes = require("./routes/userRoutes");




app.set('view engine', 'ejs');

app.use('/', userRoutes);







var usp = io.of('/user-namespace');




const updateUserOnlineStatus = async (username1,userId) => {
  try {

    const queryString = `UPDATE t_personnel_details SET f_isonline = '1' WHERE  f_Student_id = ${username1}`;
    const values = [username1,userId];
    await sql.query(queryString, values);

    console.log('User online status updated successfully');
  } catch (error) {
    console.error('Error updating user online status:', error);
  }
};

const updateUserOfflineStatus = async (username1,userId) => {
  try {
   
    const queryString = `UPDATE t_personnel_details SET f_isonline = '0' WHERE  f_Student_id = ${username1}`;
    const values = [username1,userId];
    await sql.query(queryString, values);

    console.log('User online status updated successfully');
  } catch (error) {
    console.error('Error updating user online status:', error);
  }
};

usp.on('connection',async function (socket) {

    const userId = socket.handshake.auth.token;

       const username1 = socket.handshake.query.auth
    
  await updateUserOnlineStatus(username1,userId);
    
    
   //show online user broadcast
   socket.broadcast.emit('getOnlineUser',  {user_id:userId || username1})
    
    socket.on('disconnect',async function () {

        var userId = socket.handshake.auth.token;
        const username1 = socket.handshake.query.auth
      
      await updateUserOfflineStatus(username1, userId);
      //show offline user broadcast
      
       socket.broadcast.emit('getOfflineUser',  {user_id:userId || username1})
      
        
        console.log("user disconnected");
        
    });

    // //chat implemation
    socket.on('newChat', function (data) {

        socket.broadcast.emit('loadNewChat', data);
            
    });


  socket.on('existsChat', async function (data) {
       
        
    const queryfetch = `Select * from Chat WHERE (sender_id= ${data.sender_id} and receiver_id = ${data.receiver_id} ) or (sender_id= ${data.receiver_id}  and receiver_id = ${data.sender_id}) order by f_creationdate asc`;
       
    const chats = await sql.query(queryfetch);
    

   

        
         socket.emit('loadChats',{chats:chats.recordset})
        
    
    });
})





const PORT = process.env.PORT || 3000


// const PORT = 3000;



server.listen(PORT, ()=> {
    console.log(`server is runing ${PORT}`);
});


// const PORT = `${window.location.origin}`;
// server.listen(PORT, function () {
//     console.log(`server is runing`);
// });