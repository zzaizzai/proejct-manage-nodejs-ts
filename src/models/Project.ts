class Project {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;

    constructor({ id = 0, name, description, created_at = new Date(), updated_at = new Date() }: { id?: number, name: string, description: string, created_at?: Date, updated_at?: Date }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default Project;