import { Router } from 'express';
import {
    getAllWidgets,
    getWidgetById,
    createNewWidget,
    deleteWidgetById
} from '../controllers/widgetController';

const router = Router();

router.get('/', getAllWidgets);
router.get('/:id', getWidgetById);
router.post('/', createNewWidget);
router.delete('/:id', deleteWidgetById);

export default router;
