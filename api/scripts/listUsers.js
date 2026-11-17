// Quick script to list all users in the database
// Run this with: node scripts/listUsers.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB\n');

        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

        if (users.length === 0) {
            console.log('No users found in database');
            process.exit(0);
        }

        console.log(`Found ${users.length} user(s):\n`);

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Admin: ${user.isAdmin ? 'YES ✓' : 'NO'}`);
            console.log(`   Created: ${user.createdAt?.toLocaleDateString() || 'N/A'}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
