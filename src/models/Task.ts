import { db } from '../db'
import { BasePost, BasePostData } from './BasePost'


interface TaskData extends BasePostData {
    parent_project_id: number;
}

class Task extends BasePost {

    protected _data: TaskData;
    
    static readonly TABLE_NAME: string = 'tasks'

    constructor(data: TaskData) {
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
            closed_at: data.closed_at

        }
    }

    displayInfo() {
        return { ...super.displayInfo(), parent_project_id: this._data.parent_project_id };
    }

    public getParentProjectId(): number | undefined { return this._data.parent_project_id}

    static createTask = async (
        { name = 'unknowon', description = 'no description', author = 'unknown', parentProjectId }:
        { name?: string, description?: string, author?: string, parentProjectId: number }) => {

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

    static async resetTable(): Promise<void> {
        try {
            await this.dropTaskTable()
            await this.createTable()
            await this.createTask(
                { name: 'Market Research and Analysis', 
                description: `Conduct thorough research to understand the Japanese automotive parts sector, 
                including market trends, consumer preferences, and regulatory requirements.`, 
                parentProjectId: 1 ,
                author: "test user1"
                })

            await this.createTask(
                { name: 'Establish Local Partnerships', 
                description: `Identify and establish partnerships with Japanese manufacturers, suppliers, 
                            and distributors to facilitate market entry and ensure localized support.`, 
                parentProjectId: 1 ,
                author: "test user2"
                })
                                    
            await this.createTask(
                { name: 'Customize Product Offering', 
                description: `Adapt the Project AAA product to meet the specific needs and preferences of the Japanese market, 
                            considering factors such as design, features, and pricing.`, 
                parentProjectId: 1 ,
                author: "test user3"
                })
        } catch (error) {
            console.log(error)
            throw new Error('Failed to reset projects table');
        }
    };



    static getTaskWithId =  async (id: number): Promise<Task> => {

        const row = await this.getItemWithId(this.TABLE_NAME, id)

        if (row.length === 0) {
            throw new Error('Task not found')
        }

        const project: Task = 
            new Task({
                id: row.id,
                name: row.name,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                author: row.author,
                is_closed: row.is_closed,
                due_date: row.due_date,
                parent_project_id: row.parent_project_id,
                closed_at: row.closed_at
        });

        return project
    }



    static createTable = async (): Promise<void> => {

        const sql = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
            ${this.getCommonColumns()},
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

    static getAllTasks = async (): Promise<Task[]> => {
        
        const rows = await this.getAllItem(this.TABLE_NAME)

        const tasks: Task[] = rows.map((row: any) => {
            return new Task({
                id: row.id,
                name: row.name,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                author: row.author,
                is_closed: row.is_closed,
                due_date: row.due_date,
                parent_project_id: row.parent_project_id,
                closed_at: row.closed_at
            });
        });

        return tasks
    };

    static async getTasksWithParentProjectId(parentProjectId: number, sort: string = "DESC"): Promise<Task[]> {
        try {
            const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE parent_project_id = ? ORDER BY id ${sort} ;`;
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
                    is_closed: row.is_closed,
                    due_date: row.due_date,
                    parent_project_id: row.parent_project_id,
                    closed_at: row.closed_at
                });
            });

            return tasks;
        } catch (error) {
            throw new Error('Failed to retrieve tasks with parent project ID');
        }
    }


    public async setIsClosed(): Promise<void> {
        if (this.getIsClosed()) {
            await super.setClosedAt(Task.TABLE_NAME, 'null')
            await super.setIsClosed(Task.TABLE_NAME, false)
            return 
        }
        await super.setClosedAt(Task.TABLE_NAME, 'now')
        await super.setIsClosed(Task.TABLE_NAME, true)
        return 
    }


    public async setClosedAt(): Promise<void> {
        return super.setClosedAt(Task.TABLE_NAME)
    }

}



export default Task;