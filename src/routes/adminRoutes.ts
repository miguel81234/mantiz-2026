import { Router } from 'express';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController';

const router = Router();

router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.put('/admins/:codigo_administrador', updateAdmin);
router.delete('/admins/:codigo_administrador', deleteAdmin);

export default router;