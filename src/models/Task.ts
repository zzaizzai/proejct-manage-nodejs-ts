import { db } from '../db'
import { BasePost } from './BasePost'
import { BasePostData } from './BasePost'

export interface TaskData extends BasePostData {
    dueDate: Date;
    parentProjectId?: number;
}


export class Task extends BasePost {

    dueDate: Date;
    parentProjectId?: number;

    static TABLE_NAME: string = 'tasks'

    constructor(
        { id = -1,
            name,
            description,
            created_at = new Date(),
            updated_at = new Date(),
            author = 'unknown',
            duedate = new Date(),
            parentProjectId
        }:
            {
                id?: number,
                name: string,
                description: string,
                created_at?: Date,
                updated_at?: Date,
                author?: string,
                duedate?: Date,
                parentProjectId?: number;
            }) {
        super({ id, name, description, created_at, updated_at, author });
        this.dueDate = duedate;
        this.parentProjectId = parentProjectId
    }


    displayInfo(): TaskData {
        return { ...super.displayInfo(), dueDate: this.dueDate };
    }

    static createTask = async (name: string = 'unknowon', description: string = 'no description', author: string = 'unknown') => {

        const sql = `
        INSERT INTO ${this.TABLE_NAME} (name, description, author) VALUES (?, ?, ?);
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

    static dropTaskTable(): Promise<void> {
        return this.dropTable(this.TABLE_NAME);
    }

    static resetTable = async () => {
        try {
            await this.dropTaskTable()
            await this.createTable()
            await this.createTask('test', 'ok')
        } catch (error) {
            console.log(error)
            throw new Error('Failed to reset projects table');
        }
    };


    static createTable = async (): Promise<void> => {

        const sql = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            author TEXT NOT NULL,
            parent_project_id INTEGER
        )`;
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

    static getAllTasks = async (): Promise<any[]> => {
        return this.getAll(this.TABLE_NAME)
    };
}