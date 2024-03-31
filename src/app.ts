import express, { Request, Response } from 'express';
import routeRouter from './routes/route';
import projectRouter from './routes/projects';
import taskRouter from './routes/tasks';
import { getUsers, resetTable ,createUser} from './db';
const path = require('path')
const app = express();

app
.use(express.static(path.join(__dirname, '../public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');


app.get('/', (req: Request, res: Response)=> {
    res.render('index', { name: 'Index page' });
})


app.get('/pet', (req: Request, res: Response)=> {
    res.send('hello')
})


app.get('/db/get', async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/db/reset', async (req: Request, res: Response) => {
    try {
        const users = await resetTable();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/db/create', async (req: Request, res: Response) => {
    try {

        const username = req.query.username as string;
        const email = req.query.email as string;

        if (!username || !email) {
            return res.status(400).json({ error: 'Missing username or email' });
        }

        await createUser(username, email);
        res.json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// routes
app.use('/route', routeRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);


app.listen(8080, ()=> {
    console.log('listening on 8080')
    
});
