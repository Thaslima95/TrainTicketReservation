const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "aafiya.",
  database: 'trainticketreservation',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// const sql=`CREATE TABLE train (TrainId VARCHAR(255),Source VARCHAR(255),
// Destination VARCHAR(255),
// TotalNoofSeats INT DEFAULT 9,
// NoOfLowerBerth INT DEFAULT 3,
// NoOfMiddleBerth INT DEFAULT 3,
// NoOfUpperBerth INT DEFAULT 3 )`
// connection.query(sql,(err,result)=>{
//     if(err) throw err;
//     console.log("Table created")
// })

// const sql=`CREATE TABLE Compartment (CompartID VARCHAR(255),Lower_berth ENUM('AVAILABLE','BOOKED') DEFAULT 'AVAILABLE',
// Middle_berth ENUM('AVAILABLE','BOOKED') DEFAULT 'AVAILABLE',
// Upper_berth ENUM('AVAILABLE','BOOKED') DEFAULT 'AVAILABLE')`
// connection.query(sql,(err,result)=>{
//   if(err) throw err;
//   console.log('Table created')
// })

// const sql=`INSERT INTO Compartment (CompartID,Lower_berth) VALUES ('C1','BOOKED')`
// connection.query(sql,(err,result)=>{
//   if(err) throw err;
//   console.log(result)
// })
//INSERT 
// const sql=`INSERT INTO train (TrainId,Source,Destination,TotalNoofSeats) VALUES ('MC808','Mannai','Chennai',9)`
// connection.query(sql,(err,result)=>{
//     if(err) throw err;
//     console.log(result)
// })




//Passenger Details
// const sql=`CREATE TABLE PassengerDetails (TrainId VARCHAR(255),id INT AUTO_INCREMENT PRIMARY KEY,SeatNumber VARCHAR(10) DEFAULT '0',PassengerName VARCHAR(255),Berth ENUM('L','M','U','RAC','WL') DEFAULT NULL)`
// connection.query(sql,(err,result)=>{
//     if(err) throw err;
//     console.log("Table created")
// })


// const sql1=`CREATE TABLE SEATS (id INT AUTO_INCREMENT PRIMARY KEY,seatNumber INT DEFAULT NULL,Berth ENUM('L','M','U','RAC','WL'),Status ENUM('AVAILABLE','BOOKED') DEFAULT 'AVAILABLE')`
// connection.query(sql1,(err,result)=>{
//   if(err) throw err;
//   console.log('Table created')
// })
// const sql2=`INSERT INTO SEATS (seatNumber,Berth) VALUES ?`
// const values=[[1,'L'],
// [4,'L'],
// [7,'L'],
// [2,'M'],
// [5,'M'],
// [8,'M'],
// [3,'U'],
// [6,'U'],
// [9,'U'],
// [10,'RAC'],
// [11,'RAC'],
// [null,'WL'],
// [null,'WL']]
// connection.query(sql2,[values],(err,result)=>{
//   if(err) throw err;
//   console.log(result)
// })









book('MC808','Thaslima','M')

function book(TrainId,Name,Berth)
{
  console.log(Berth)
  const sq1=`SELECT seatNumber FROM SEATS WHERE Berth='${Berth}' && status='AVAILABLE' LIMIT 1`
  connection.query(sq1,(err,result)=>{
    if(err) throw err;
    if(result.length>0)
    {
        seatNumber=result[0].seatNumber;
     const sql=`INSERT INTO PassengerDetails (TrainId,SeatNumber,PassengerName,Berth) VALUES ('${TrainId}',CONCAT('S',${result[0].seatNumber}),'${Name}','${Berth}')`
connection.query(sql,(err,result)=>{
  if(err) throw err;
  
  connection.query(`UPDATE SEATS SET status='BOOKED' WHERE seatNumber=${seatNumber} `,(err,result)=>{
    if(err) throw err;
    console.log("Ticket Booked")
  })
})
    }
    else{
      const sql=`SELECT * FROM SEATS WHERE Berth IN ('L','M','U')  && Status='AVAILABLE' LIMIT 1`
      connection.query(sql,(err,result)=>{
        if(err) throw err;
       
        if(result.length>0)
        {
             if((Berth=='L'|| Berth=='U')&& (result[0].Berth=='M'))
      {
        Berth='M';
        
       return insertT(TrainId,Name,Berth)
       
      }
      else if((Berth=='L'|| Berth=='M' )&& (result[0].Berth=='U'))
      {
        Berth='U';
        
        return insertT(TrainId,Name,Berth)
      }
      else if((Berth=='M'|| Berth=='U')&& (result[0].Berth=='L'))
      {
        Berth='L';
        
        return insertT(TrainId,Name,Berth)
        
      }
        }
        else{
          const sql=`SELECT * FROM SEATS WHERE Berth='RAC' && status='AVAILABLE' LIMIT 1`
          connection.query(sql,(err,result)=>{
            if(err) throw err;
            if(result.length>0)
            {
              seatNumber=result[0].seatNumber;
             const sql=`INSERT INTO PassengerDetails (TrainId,SeatNumber,PassengerName,BERTH) VALUES ('${TrainId}',CONCAT('S',${result[0].seatNumber}),'${Name}','${result[0].Berth}') `
             connection.query(sql,(err,result)=>{
              if(err) throw err;
              connection.query(`UPDATE SEATS SET status='BOOKED' WHERE seatNumber=${seatNumber} `,(err,result)=>{
                if(err) throw err;
                console.log("Ticket Booked with RAC")
              })
             })
            }
            else{
                 const sql=`SELECT * FROM SEATS WHERE Berth='WL' && status='AVAILABLE' LIMIT 1`
                 connection.query(sql,(err,result)=>{
                  if(err) throw err;
                  if(result.length>0)
                  {
                    id=result[0].id
                    const sql=`INSERT INTO PassengerDetails (TrainId,PassengerName,BERTH) VALUES ('${TrainId}','${Name}','WL')`
                    connection.query(sql,(err,result)=>{
                      if(err) throw err;
                      connection.query(`UPDATE SEATS SET status='BOOKED' WHERE id=${id}`,(err,result)=>{
                        if(err) throw err;
                        console.log("You are in Waiting List")
                      })
                    })
                  }
                  else{
                    console.log('No Tickets Available')
                  }
                 })
            }
          })
        }
      })
    }
  })
 
}


function cancel(TrainId,Name,seatNumber)
{
  let seatNumber1=seatNumber;
  const sql1=`SELECT BERTH FROM PassengerDetails WHERE PassengerName='${Name}' && seatNumber='${seatNumber}'`
  connection.query(sql1,(err,result)=>{
    if(err) throw err;
    let berth=result[0].BERTH;
      const sql=`DELETE FROM PassengerDetails WHERE PassengerName='${Name}' && seatNumber='${seatNumber}'`
  connection.query(sql,(err,result)=>{
    if(err) throw err;
    console.log("Cancelled sucess")
    connection.query(`UPDATE SEATS SET status='AVAILABLE' WHERE seatNumber='${seatNumber.substring(1)}'`,(err,result)=>{
      if(err) throw err;
      const sql=`SELECT * FROM PassengerDetails WHERE BERTH='RAC' LIMIT 1`
      connection.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length>0)
        {
          console.log(result)
          TrainId=result[0].TrainId;
          Name=result[0].PassengerName;
          seatNumber=result[0].SeatNumber;
          
          const sql=`UPDATE PassengerDetails SET seatNumber='${seatNumber1}',BERTH='${berth}' WHERE id=${result[0].id}`
          connection.query(sql,(err,result)=>{
            if(err) throw err;
            connection.query(`UPDATE SEATS SET status='BOOKED' WHERE seatNumber='${seatNumber1.substring(1)}'`,(err,result)=>{
              if(err) throw err;
              const sql=`SELECT * FROM PassengerDetails WHERE BERTH='WL' LIMIT 1`
              connection.query(sql,(err,result)=>{
                if(err) throw err;
                if(result.length>0)
                {
                  TrainId=result[0].TrainId;
                  Name=result[0].PassengerName;
                  id=result[0].id;
                  console.log(result)
                  connection.query(`UPDATE PassengerDetails SET seatNumber='${seatNumber}',BERTH='RAC' WHERE id=${id}`,(err,result)=>{
                    if(err) throw err;
                   connection.query(`UPDATE SEATS SET status='BOOKED' WHERE seatNumber='${seatNumber.substring(1)}'`,(err,result)=>{
                if(err) throw err;
                connection.query(`UPDATE SEATS SET status='AVAILABLE' WHERE id=(SELECT id FROM (SELECT min(id) as id FROM SEATS AS s WHERE Berth='WL') AS tmp)`,(err,result)=>{
                  if(err) throw err;
                  console.log(result)
                })
              })
                  })
                }
              })
              
            })
          })
        }
      })
    })
  })
  })

}

// cancel('MC808','Thaslima','S8')





//Drop Table
// 


// const sql=`DROP TABLE PassengerDetails`
// connection.query(sql,(err,result)=>{
//     if(err) throw err;
//     console.log("table deleted")
// })


// const sql1=`DROP TABLE SEATS`
// connection.query(sql1,(err,result)=>{
//     if(err) throw err;
//     console.log("table deleted")
// })
