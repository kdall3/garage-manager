import mysql from 'mysql2';

type DBInfo = {
    host: string;
    user: string;
    password: string;
    database: string;
};

function getConnections(db_info: DBInfo) {
    const pool = mysql.createPool({
        host: db_info.host,
        user: db_info.user,
        password: db_info.password,
        database: db_info.database
    }).promise();
}