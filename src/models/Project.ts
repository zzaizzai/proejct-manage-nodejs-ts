import { db } from '../db'
import { BasePost } from './BasePost'

class Project extends BasePost {

    static TABLE_NAME: string = 'projects'

    static createProject = async (name: string = 'unknowon', description: string = 'no description', author: string = 'unknown'): Promise<void> => {

        const sql =                 `
        INSERT INTO projects (name, description, author) VALUES (?, ?, ?);
        `;
        return new Promise<void>((resolve, reject) => {
            db.run(sql, [name, description, author], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    static getProjectsWithId =  async (id: number): Promise<Project[]> => {

        const sql = `
        SELECT * from ${this.TABLE_NAME} WHERE id = ? ;
        `;
        const getProjects =  new Promise<any[]>((resolve, reject) => {
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        const rows = await getProjects
        const projects: Project[] = rows.map((row: any) => {
            return new Project({
                id: row.id,
                name: row.name,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                author: row.author,
                is_closed: row.is_closed
            });
        });

        return projects


    }

    static createTable = async () => {

        const sql = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
            ${this.getCommonColumns()}
        )
    `;
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

    static dropProjectTable() {
        return this.dropTable(this.TABLE_NAME);
    }


    static resetTable = async (): Promise<void> => {
        try {
            await this.dropProjectTable()
            await this.createTable()
            await this.createProject('Launch Project AAA in Japan', 
                                    `We envision that this project will create new opportunities to foster 
                                    innovation and collaboration within our industry. By leveraging Japan's 
                                    rich technological expertise and our company's resources, we aim to introduce 
                                    groundbreaking solutions that address evolving market demands. Through strategic 
                                    partnerships and localized initiatives, we aspire to establish a strong foothold in 
                                    the Japanese market, driving sustainable growth and establishing ourselves as a key 
                                    player in the automotive sector. `,
                                    "test manager1")
            await this.createProject('Develop new Product to calculate the lenght of the Earth',
                                    `It is important to calculate the length of the Earth because 
                                    it enables us to gain deeper insights into geographical phenomena 
                                    and better understand the dynamics of our planet. By accurately measuring Earth's 
                                    dimensions, we can enhance navigation systems, improve infrastructure planning, 
                                    and advance scientific research. Moreover, it facilitates global collaboration and 
                                    fosters a deeper appreciation for the complexity and beauty of our world.`,
                                    "test manager2")
        } catch (error) {
            console.log(error)
            throw new Error('Failed to reset projects table');
        }
    };

    static getAllProjects = async (): Promise<Project[]> => {

        const rows = await this.getAllItem(this.TABLE_NAME)
        const projects: Project[] = rows.map((row: any) => {
            return new Project({
                id: row.id,
                name: row.name,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                author: row.author,
                is_closed: row.is_closed
            });
        });

        return projects
    };

    static async getProjectWithId(id: number, order: string = "DESC"): Promise<Project> {
        try {
            const row = await this.getItemWithId(this.TABLE_NAME, id, order)

            if (row.length === 0) {
                throw new Error('Task not found')
            }

            const tasks: Project = new Project({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    author: row.author,
                    is_closed: row.is_closed
            });

            return tasks;
        } catch (error) {
            throw new Error('Failed to retrieve tasks with parent project ID');
        }
    }


}




export default Project;