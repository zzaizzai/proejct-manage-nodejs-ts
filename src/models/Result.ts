import { db } from '../db'
import {BasePost, BasePostData} from './BasePost'


interface ResultData extends BasePostData {
    parent_project_id: number;
    parent_task_id: number;
}

export class Result extends BasePost {

    protected _data: ResultData


    static readonly TABLE_NAME: string = 'results'

    constructor(data: ResultData) {
        super({ 
            id: data.id, 
            name: data.name, 
            description: data.description, 
            created_at: data.created_at, 
            updated_at: data.updated_at, 
            author: data.author, 
            is_closed: data.is_closed ,
            due_date: data.due_date,
            closed_at: data.closed_at
        });

        this._data =  {
            id: data.id, 
            name: data.name, 
            description: data.description, 
            created_at: data.created_at, 
            updated_at: data.updated_at, 
            author: data.author, 
            is_closed: data.is_closed ,
            due_date: data.due_date,
            parent_project_id: data.parent_project_id,
            parent_task_id: data.parent_task_id,
            closed_at: data.closed_at

        }
    }

    public parentProjectId(): number {
        return this._data.parent_project_id
    }

    displayInfo() {
        return { ...super.displayInfo(), parentProjectId: this._data.parent_project_id , parentTaskId: this._data.parent_project_id};
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
            await this.createResult({ name: 'testresult1', description: 'task 1 done', author: "test user1" , parentProjectId: 1, parentTaskId: 1 })
            await this.createResult({ name: 'testresult2', description: 'task 2 done', author: "test user2", parentProjectId: 1, parentTaskId: 2 })
            await this.createResult({ name: 'testresult3', description: 'task 3 done', author: "test user3", parentProjectId: 1, parentTaskId: 2 })

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
                due_date: row.due_date,
                parent_project_id: row.parent_project_id,
                parent_task_id: row.parent_project_id,
                closed_at: row.closed_at
            });
        });

        return tasks
    };



    static getAllResultsWithParentTaskId = async (parentTaskId: number, order: string = 'DESC'): Promise<Result[]> => {

        try {
            const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE parent_task_id = ? ORDER BY id ${order} ;`;
            const rows = await new Promise<any[]>((resolve, reject) => {
                db.all(sql, [parentTaskId], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });


        const results: Result[] = rows.map((row: any) => {
            return new Result({
                id: row.id,
                name: row.name,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                author: row.author,
                is_closed: row.is_closed,
                due_date: row.due_date,
                parent_project_id: row.parent_project_id,
                parent_task_id: row.parent_project_id,
                closed_at: row.closed_at
            });
        });

        return results

        } catch (error) {
            throw new Error('Failed to retrieve tasks with parent project ID');
        }
    }


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
                    due_date: row.due_date,
                    parent_project_id: row.parent_project_id,
                    parent_task_id: row.parent_task_id,
                    closed_at: row.closed_at
            });

            return tasks;
        } catch (error) {
            throw new Error('Failed to retrieve tasks with parent project ID');
        }
    }

}


export default Result;