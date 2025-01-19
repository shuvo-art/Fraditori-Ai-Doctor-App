import express, { Request, Response, RequestHandler } from 'express';
import { Subscription } from './subscription.model';

interface Params {
  userId: string; // Define the userId parameter explicitly
}

interface UpdateSubscriptionRequest {
  type: 'Free' | 'Premium';
}

const router = express.Router();

// Get user subscription
router.get(
  '/:userId',
  (async (req: Request<Params>, res: Response): Promise<void> => {
    try {
      const subscription = await Subscription.findOne({ user: req.params.userId });
      if (!subscription) {
        res.status(404).json({ success: false, message: 'Subscription not found' });
        return;
      }
      res.status(200).json({ success: true, subscription });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }) as RequestHandler<Params>
);

// Update user subscription type
router.put(
  '/:userId',
  (async (req: Request<Params, {}, UpdateSubscriptionRequest>, res: Response): Promise<void> => {
    try {
      const { type } = req.body;
      const subscription = await Subscription.findOneAndUpdate(
        { user: req.params.userId },
        { type },
        { new: true }
      );
      if (!subscription) {
        res.status(404).json({ success: false, message: 'Subscription not found' });
        return;
      }
      res.status(200).json({ success: true, subscription });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }) as RequestHandler<Params>
);

export default router;
