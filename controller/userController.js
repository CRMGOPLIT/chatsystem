
const sql = require('mssql');






const loadDashboard = async (req, res)=>{
    try {

          const counsellorid = req.query.counsellorid;
 const queryfetch = `select distinct f_Student_id,f_First_name,isnull(f_middle_name,'') f_middle_name,isnull(f_Last_Name,'') f_Last_Name,f_Mobile,f_Email,lo.name,lo.userid , f_isonline as is_online from t_personnel_details pd join login lo on lo.userid= pd.f_counsellor_user_id where f_counsellor_user_id = ${counsellorid} and isnull(f_android_key,'')!=''`;
        var users = await sql.query(queryfetch);

          res.render('dashboard',{user:req.session.user, users:users.recordsets[0],counsellorid:counsellorid})
      
    } catch (error) {
        
  
    }
    
}


// const saveChat = async (req, res) => {
    
//     try {

//         var chat = Chat({
//             sender_id: req.body.sender_id,
//             receiver_id: req.body.receiver_id,
//             message:req.body.message,
//         })
//       var newChat =  await chat.save();
//         res.status(200).send({success:true,message:"Chat inserted succesfully", data:newChat})
        
//     } catch (error) {

//         res.status(400).send({success:false,message:error.message})
        
//     }
// }



//Get all user
const getAllSQlUser = async (req, res) => {
    try {
        
      
        const counsellorid = req.query.counsellorid;
       
         const queryfetch = `select distinct f_Student_id,f_First_name,isnull(f_middle_name,'') f_middle_name,isnull(f_Last_Name,'') f_Last_Name,f_Mobile,f_Email,lo.name,lo.userid , f_isonline as is_online from t_personnel_details pd join login lo on lo.userid= pd.f_counsellor_user_id where f_counsellor_user_id = ${counsellorid} and isnull(f_android_key,'')!=''`;
       
        const resultdata = await sql.query(queryfetch);
        

         res.status(200).json({ seccess: true, msg: "User details",result: resultdata.recordsets[0]})

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error in Getall Products",
            error
        })

    }


}


const getconsoller = async (req, res) => {
    
    const studentid = req.query.studentid;
       
         const queryfetch = `select userid,name,email,mobile from login where userid = (select f_counsellor_user_id from t_personnel_details where f_student_id = ${studentid})`;
       
        const resultdata = await sql.query(queryfetch);
        

         res.status(200).json({ seccess: true, msg: "User details",consellordata: resultdata.recordsets[0]})

}



const saveChatSql = async (req, res) => {
    try {
        const { sender_id, receiver_id, message, } = req.body;

        function getCurrentTime() {
  const now = new Date();
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  return now.toLocaleTimeString('en-US', options);
}
        const query = `
            INSERT INTO Chat (sender_id, receiver_id, message, timestamp) 
            VALUES ('${sender_id}', '${receiver_id}', '${message}', ' ${getCurrentTime()}')
        `;
        const values = [{
            sender_id: sender_id,
            receiver_id: receiver_id,
            message: message,
            timestamp: getCurrentTime()
        }];
       
       await sql.query(query, values);

    

        res.status(200).json({
            success: true,
            message: "Chat inserted successfully",
            
            data:values
        });
    } catch (error) {
        console.error('Error saving chat:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};




const getChatByIdSql = async (req, res) => {
    try {
       

         const senderId =  req.query.sender_id ;
        const receiverId = req.query.receiver_id;
        
      //  const queryfetch = `Select *,f_creationdate date from Chat WHERE (sender_id= ${senderId} and receiver_id = ${receiverId} ) or (sender_id= ${receiverId}  and receiver_id = ${senderId})  order by f_creationdate asc`;
       const queryfetch = `select sender_id,receiver_id,message,timestamp,
case when convert(date,f_creationdate)=convert(date,Nextentry) then null
else f_creationdate end as date
from (
select *,lag(f_creationdate) over (order by f_creationdate asc) Nextentry from chat WHERE (sender_id= ${senderId} and receiver_id = ${receiverId} ) or (sender_id= ${receiverId}  and receiver_id = ${senderId})) s order by f_creationdate asc`
  
        const resultdata = await sql.query(queryfetch);
   
        res.status(200).json({ success: true, message: "Chat details",  allchat: resultdata.recordsets[0] });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ success: false, message: "Error in fetching chats", error });
    }
};


module.exports = {
    loadDashboard,
    getAllSQlUser,
    saveChatSql,
    getChatByIdSql,
    getconsoller
}