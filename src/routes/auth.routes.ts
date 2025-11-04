import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { authController } from '../controllers/auth.controller';
import { signupSchema, loginSchema } from '../validations/auth.schema';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', requireAuth, authController.getCurrentUser);

export const authRouter = router;