
const promiseMysql = require('promise-mysql');
let pool;

const createPool = async  () =>{
  pool = await promiseMysql.createPool({
  host     : 'google',
  //socketPath: '/cloudsql/centered-sight-237801:asia-northeast3:test',
  // port      : '3306',
  host     : '192.168.0.103',
  port     : 3306,
  user     : 'xiphoid',
  password : 'wkfgkwk!@12',
  database : 'capsdb',
  connectionLimit: 5
});
};
createPool();

const simpleQuery = fn => async ( ...args) =>{
    let con = await pool.getConnection()
    /* 비지니스 로직에 con을 넘겨준다. */
    
    const result = await fn(con, ...args).catch(error => { 
        console.log(error)
        con.connection.release();
        throw error;
    });
    /* con을 닫아준다. */
    //console.log('rr',result)
    con.connection.release();
    return result;
    
};
const transaction = fn => async ( ...args) =>{
    let con = await pool.getConnection()
    /* 비지니스 로직에 con을 넘겨준다. */
    await con.connection.beginTransaction();
    const result = await fn(con, ...args).catch( async(error) => { 
        await con.rollback();
        con.connection.release();
        throw error;
    });
    /* con을 닫아준다. */
    //console.log('rr',result)
    await con.commit();
    con.connection.release();
    return result;
};

const connection = async () =>{
    let con = await pool.getConnection();
    return con;
}




module.exports.simpleQuery = simpleQuery;
module.exports.transaction = transaction;
module.exports.connection = connection;