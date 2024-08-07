import { Router } from 'express';
import { crearToken, find, index, store, update, partialUpdate, remove, verificarToken } from '../controllers/user.controller.js';

const router = Router();

router.get('/', index);
router.post('/', store);
router.post('/crear-token', crearToken);
router.get('/verificar-token', verificarToken);
router.get('/:id', find);
router.put('/:id', update);
router.patch('/:id', partialUpdate);
router.delete('/:id', remove);

export default router;
