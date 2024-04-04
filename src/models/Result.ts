import { db } from '../db'
import { BasePost } from './BasePost'
import { BasePostData } from './BasePost'

export interface ResultData extends BasePostData {
    parentProjectId?: number;
    parentTaskId?: number;
}

export class Result extends BasePost {

    parentProjectId?: number;
    parentTaskId?: number;

    static TABLE_NAME: string = 'results'

    constructor(
        { id = -1,
            name,
            description,
            created_at = new Date(),
            updated_at = new Date(),
            author = 'unknown',
            parentProjectId,
            parentTaskId
        }:
        {
            id?: number,
            name: string,
            description: string,
            created_at?: Date,
            updated_at?: Date,
            author?: string,
            duedate?: Date,
            parentProjectId?: number,
            parentTaskId?: number
        }) {
        super({ id, name, description, created_at, updated_at, author });
        this.parentProjectId = parentProjectId
        this.parentTaskId = parentTaskId
    }


    displayInfo(): ResultData {
        return { ...super.displayInfo(), parentProjectId: this.parentProjectId , parentTaskId: this.parentProjectId};
    }

    static createResult = async (
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

    static dropResultTable(): Promise<void> {
        return this.dropTable(this.TABLE_NAME);
    }

    static resetTable = async () => {
        try {
            await this.dropResultTable()
            await this.createTable()
            await this.createResult({ name: 'testresult', description: 'ok' })
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
            created_at TIMESTAMP  DEFAULT (DATETIME(CURRENT_TIMESTAMP,'localtime')),
            updated_at TIMESTAMP  DEFAULT (DATETIME(CURRENT_TIMESTAMP,'localtime')),
            author TEXT NOT NULL,
            parent_project_id INTEGER,
            parent_task_id INTEGER
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

    static getAllResults = async (): Promise<Result[]> => {
        
        const rows = await this.getAllItem(this.TABLE_NAME)

        const tasks: Result[] = rows.map((row: any) => {
            return new Result({
                id: row.id,
                name: row.name,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                author: row.author,
                parentProjectId: row.parent_project_id,
                parentTaskId: row.parent_project_id
            });
        });

        return tasks
    };




}
