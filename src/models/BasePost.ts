import { db } from '../db'
import moment from 'moment';


export interface BasePostData {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    author: string;
    is_closed: boolean;
    due_date:Date | undefined;
}

export abstract class BasePost {
    protected _data: BasePostData;
    
    constructor(data: BasePostData) 
        {   
            this._data = {

                id : data.id,
                name : data.name,
                description : data.description,
                created_at : data.created_at,
                updated_at : data.updated_at,
                author : data.author,
                is_closed : data.is_closed,
                due_date : data.due_date,
            }


        }
        

    public getId(): number {return this._data.id}
    public getName(): string {return this._data.name}
    public getDescription(): string {return this._data.description}
    public getAuthor(): string {return this._data.author}
    public getIsClosed(): boolean {return this._data.is_closed}
    public getCreatedAt(): Date {return this._data.created_at}
    public getUpdatedAt(): Date {return this._data.updated_at}
    public getDueDate(): Date | undefined {return this._data.due_date}

    protected static getCommonColumns(): string {
        const sql: string = `
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP  DEFAULT (DATETIME(CURRENT_TIMESTAMP,'localtime')),
        updated_at TIMESTAMP  DEFAULT (DATETIME(CURRENT_TIMESTAMP,'localtime')),
        author TEXT NOT NULL,
        is_closed INTEGER DEFAULT 0
        `

        return sql
    }

    public displayInfo() {
        const info: any = {};
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                info[key] = this[key];
            }
        }
        return info;
    }

    public displayTime(): string {
        const created = this.displayCreatedAt()
        const updated = this.displayUpdatedAt()

        if ( created != updated) {
            return `${created}(${updated})`
        }
        return created
    }

    public displayCreatedAt(): string {
        return this.datetimeFormat(this.getCreatedAt());
    }
    public displayUpdatedAt(): string {
        return this.datetimeFormat(this.getUpdatedAt());
    }

    protected datetimeFormat(datetime: Date): string {
        return moment(datetime).format('YY-MM-DD HH:mm:ss');
    }

    protected static dropTable = async (tableName: string): Promise<void> => {
        const sql = `DROP TABLE IF EXISTS  ${tableName};`;
        return new Promise<void>((resolve, reject) => {
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(`Table ${tableName} dropped successfully`);
                resolve();
            });
        });
    };

    protected static getItemWithId = async (tableName:string, id: number, order: string = 'DESC'): Promise<any> => {
        const sql = `SELECT * FROM ${tableName} where id = ${id} ORDER BY id ${order} ;`;
        return new Promise<any>((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });
        });
    }

    protected static getAllItem = async (tableName: string, sort: string = 'DESC') => {
        const sql = `SELECT * FROM ${tableName} ORDER BY id ${sort} ;`;
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


    public async setIsClosed(tableName: string, changeToState: boolean): Promise<void> {

        const updateSql = `UPDATE ${tableName} SET is_closed = ${changeToState} WHERE id = ${this.getId()};`;

        return new Promise<void>((resolve, reject) => {
            db.all(updateSql, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}