import { Router } from 'express';
import { getProviders, createProvider, updateProvider, deleteProvider } from '../controllers/providerController';

const router = Router();

router.get('/providers', getProviders);
router.post('/providers', createProvider);
router.put('/providers/:codigo_provedor', updateProvider);
router.delete('/providers/:codigo_provedor', deleteProvider);

export default router;