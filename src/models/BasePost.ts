interface BasePostData {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export class BasePost implements BasePostData {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;

    constructor({ id = -1, name, description, created_at = new Date(), updated_at = new Date() }:
        { id?: number, name: string, description: string, created_at?: Date, updated_at?: Date }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    displayInfo(): BasePostData {
        return { id: this.id, name: this.name, description: this.description, created_at: this.created_at, updated_at: this.updated_at }
    }

}