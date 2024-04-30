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
}

export abstract class BasePost implements BasePostData {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    author: string;
    is_closed: boolean

    constructor({ id = -1, name, description, created_at = new Date(), updated_at = new Date(), author = 'unknown', is_closed = false }:
        { id?: number, name: string, description: string, created_at?: Date, updated_at?: Date, author?: string, is_closed: boolean }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.author = author;
        this.is_closed = is_closed;
    }

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

    public displayInfo(): BasePostData {
        return { id: this.id, name: this.name, description: this.description, created_at: this.created_at, updated_at: this.updated_at, author: this.author, is_closed: this.is_closed }
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
        return this.datetimeFormat(this.created_at);
    }
    public displayUpdatedAt(): string {
        return this.datetimeFormat(this.updated_at);
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
        const sql = `SELECT * FROM ${tableName} where id = ${id} ORDER BY created_at ${order} ;`;
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

        const item = await BasePost.getItemWithId(tableName, this.id)
        const updateSql = `UPDATE ${tableName} SET is_closed = ${changeToState} WHERE id = ${this.id};`;

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