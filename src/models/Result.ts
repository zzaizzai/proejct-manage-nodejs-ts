import { db } from '../db'
import { BasePost } from './BasePost'
import { BasePostData } from './BasePost'

export interface ResultData extends BasePostData {
    parentProjectId: number;
    parentTaskId: number;
}

export class Result extends BasePost {

    parentProjectId: number;
    parentTaskId: number;


    static readonly TABLE_NAME: string = 'results'

    constructor(
        { id = -1,
            name,
            description,
            created_at = new Date(),
            updated_at = new Date(),
            author = 'unknown',
            is_closed = false,
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
            is_closed: boolean,
            duedate?: Date,
            parentProjectId: number,
            parentTaskId: number
        }) {
        super({ id, name, description, created_at, updated_at, author, is_closed });
        this.parentProjectId = parentProjectId
        this.parentTaskId = parentTaskId
    }


    displayInfo(): ResultData {
        return { ...super.displayInfo(), parentProjectId: this.parentProjectId , parentTaskId: this.parentProjectId};
    }

    static createResult = async (
        { name = 'unknowon', description = 'no description', author = 'unknown', parentProjectId = 1,  parentTaskId = 1 }:
        { name?: string, description?: string, author?: string, parentProjectId?: number, parentTaskId?: number }) => {

        const sql = `
        INSERT INTO ${this.TABLE_NAME} (name, description, author, parent_project_id, parent_task_id) VALUES (?, ?, ?, ?, ?);
        `;
        return new Promise<void>((resolve, reject) => {
            db.run(sql, [name, description, author, parentProjectId, parentTaskId], (err) => {
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
            await this.createResult({ name: 'testresult', description: 'task 1 done', author: "test user1" , parentProjectId: 1, parentTaskId: 1 })
            await this.createResult({ name: 'testresult', description: 'task 2 done', author: "test user2", parentProjectId: 1, parentTaskId: 2 })
        } catch (error) {
            console.log(error)
            throw new Error('Failed to reset projects table');
        }
    };

    static createTable = async (): Promise<void> => {

        const sql = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
            ${this.getCommonColumns()},
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
                is_closed: row.is_closed,
                parentProjectId: row.parent_project_id,
                parentTaskId: row.parent_project_id
            });
        });

        return tasks
    };


    static async getResultWithId(id: number, order: string = "DESC"): Promise<Result> {
        try {
            const row = await this.getItemWithId(this.TABLE_NAME, id, order)

            if (row.length === 0) {
                throw new Error('Task not found')
            }

            const tasks: Result = new Result({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    author: row.author,
                    is_closed: row.is_closed,
                    parentProjectId: row.parent_project_id,
                    parentTaskId: row.parent_task_id
            });

            return tasks;
        } catch (error) {
            throw new Error('Failed to retrieve tasks with parent project ID');
        }
    }

}


export default Result;