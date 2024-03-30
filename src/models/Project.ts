import { db } from '../db'
import { BasePost } from './BasePost'

class Project extends BasePost {

    static TABLE_NAME: string = 'projects'

    static createProject = async (name: string = 'unknowon', description: string = 'no description', author: string = 'unknown') => {

        const sql =                 `
        INSERT INTO projects (name, description, author) VALUES (?, ?, ?);
        `;
        return new Promise<void>((resolve, reject) => {
            db.run(sql, [name, description, author], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

    }

    static getProjects =  async (id: number) => {

        const sql = `
        SELECT * from ${this.TABLE_NAME} WHERE id = ? ;
        `;
        return new Promise<any[]>((resolve, reject) => {
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    static createTable = async () => {

        const sql = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            author TEXT NOT NULL
        )
    `;
        return new Promise<void>((resolve, reject) => {
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    static dropProjectTable() {
        return this.dropTable(this.TABLE_NAME);
    }


    static resetTable = async () => {
        try {
            await this.dropProjectTable()
            await this.createTable()
            await this.createProject('test', 'ok')
        } catch (error) {
            console.log(error)
            throw new Error('Failed to reset projects table');
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