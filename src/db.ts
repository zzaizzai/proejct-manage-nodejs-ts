// db.ts

import sqlite3 from 'sqlite3';

// SQLite 데이터베이스 파일 경로
const dbPath = './database.db';

// 데이터베이스 생성 또는 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        return;
    }
    console.log('Connected to the SQLite database');
});


export const resetTable = () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `;
    const dropTableSQL = 'DROP TABLE IF EXISTS users';

    db.serialize(() => {
        db.run(dropTableSQL, (err) => {
            if (err) {
                console.error('Error dropping table', err);
                return;
            }
            console.log('Table dropped successfully');
        });

        db.run(createTableSQL, (err) => {
            if (err) {
                console.error('Error creating table', err);
                return;
            }
            console.log('Table created successfully');
        });
    });
};

// CREATE
export const createUser = (username: string, email: string) => {
    const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
    db.run(sql, [username, email], (err) => {
        if (err) {
            console.error('Error inserting user', err);
            return;
        }
        console.log('User inserted successfully');
    });
};

// READ
export const getUsers = () => {
    const sql = 'SELECT * FROM users';
    return new Promise<any[]>((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

// UPDATE
export const updateUserEmail = (userId: number, newEmail: string) => {
    const sql = 'UPDATE users SET email = ? WHERE id = ?';
    db.run(sql, [newEmail, userId], (err) => {
        if (err) {
            console.error('Error updating user email', err);
            return;
        }
        console.log('User email updated successfully');
    });
};

// DELETE
export const deleteUser = (userId: number) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, userId, (err) => {
        if (err) {
            console.error('Error deleting user', err);
            return;
        }
        console.log('User deleted successfully');
    });
};