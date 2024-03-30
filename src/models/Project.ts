import { db } from '../db'
import { BasePost } from './BasePost'

class Project extends BasePost {


    static createProject = async (name: string, description: string) => {

        try {
            const insertDataQuery =
                `
                INSERT INTO projects (name, description) VALUES (?, ?)
                `;
            await db.run(insertDataQuery, [name, description]);
            console.log('Data inserted into projects table');
        } catch (error) {
            throw new Error('Failed to create projects table');
        }
    }

    static createTable = async () => {
        try {

            await db.run('DROP TABLE IF EXISTS projects');
            console.log('Projects table dropped successfully');

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;
            await db.run(createTableQuery);
            console.log('Projects table created successfully');

            const insertDataQuery =
                `
                INSERT INTO projects (name, description) VALUES (?, ?)
                `;
            await db.run(insertDataQuery, ['test', 'ok']);
            console.log('Data inserted into projects table');
        } catch (error) {
            throw new Error('Failed to create projects table');
        }
    };

    static getAllProjects = async () => {
        const sql = 'SELECT * FROM projects';
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
}

export default Project;