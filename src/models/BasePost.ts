import { db } from '../db'

export interface BasePostData {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    author: string;
}

export abstract class BasePost implements BasePostData {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    author: string

    constructor({ id = -1, name, description, created_at = new Date(), updated_at = new Date(), author = 'unknown' }:
        { id?: number, name: string, description: string, created_at?: Date, updated_at?: Date, author?: string }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.author = author;
    }

    displayInfo(): BasePostData {
        return { id: this.id, name: this.name, description: this.description, created_at: this.created_at, updated_at: this.updated_at, author: this.author }
    }

    static dropTable = async (tableName: string) => {
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


    static getAll = async (tableName: string) => {
        const sql = `SELECT * FROM ${tableName};`;
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