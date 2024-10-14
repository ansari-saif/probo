import { Request, Response } from 'express';
import { Task } from '../models/task';

let tasks: Task[] = [];
let nextId = 1;

// Create a new task
export const createTask = (req: Request, res: Response) => {
    const task: Task = {
        id: nextId++,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed || false,
    };
    tasks.push(task);
    res.status(201).json(task);
};

// Get all tasks
export const getTasks = (req: Request, res: Response) => {
    res.json(tasks);
};

// Get a single task
export const getTaskById = (req: Request, res: Response): Response => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send('Invalid task ID');
    }
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).send('Task not found');
    }
    return res.json(task);
};


// Update a task
export const updateTask = (req: Request, res: Response) => {
    const task = tasks.find(t => t.id === Number(req.params.id));
    if (!task) {
        return res.status(404).send('Task not found');
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    res.json(task);
};

// Delete a task
export const deleteTask = (req: Request, res: Response) => {
    tasks = tasks.filter(t => t.id !== Number(req.params.id));
    res.status(204).send();
};
