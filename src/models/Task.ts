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

    static createTask = async (
        { name = 'unknowon', description = 'no description', author = 'unknown', parentProjectId }:
        { name?: string, description?: string, author?: string, parentProjectId?: number }) => {

        const sql = `
        INSERT INTO ${this.TABLE_NAME} (name, description, author, parent_project_id) VALUES (?, ?, ?, ?);
        `;
        return new Promise<void>((resolve, reject) => {
            db.run(sql, [name, description, author, parentProjectId], (err) => {
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
            await this.createTask({ name: 'test', description: 'ok' })
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

    showTest(): string {
        return 'good'
    }

    static async getTasksWithParentProjectId(parentProjectId: number): Promise<Task[]> {
        try {
            const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE parent_project_id = ?`;
            const rows = await new Promise<any[]>((resolve, reject) => {
                db.all(sql, [parentProjectId], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            const tasks: Task[] = rows.map((row: any) => {
                return new Task({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    author: row.author,
                    parentProjectId: row.parent_project_id
                });
            });

            return tasks;
        } catch (error) {
            throw new Error('Failed to retrieve tasks with parent project ID');
        }
    }
}