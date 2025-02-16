import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    try {
        const users = await User.find().sort({ createdAt: -1 }).limit(10).select('firstName lastName email createdAt');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent signups' });
    }
}
