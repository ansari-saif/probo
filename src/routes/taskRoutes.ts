import { Router } from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskById,
} from '../controllers/taskController';

const router = Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
