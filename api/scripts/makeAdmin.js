// Script to set a user as admin in MongoDB
// Run this with: node scripts/makeAdmin.js <username>

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const makeAdmin = async (username) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            console.error(`User "${username}" not found`);
            process.exit(1);
        }

        // Check if already admin
        if (user.isAdmin) {
            console.log(`User "${username}" is already an admin`);
            process.exit(0);
        }

        // Set as admin
        user.isAdmin = true;
        await user.save();

        console.log(`✅ Successfully set "${username}" as admin`);
        console.log('User details:', {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        });

        console.log('\n⚠️  IMPORTANT: You must log out and log back in for changes to take effect!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Get username from command line arguments
const username = process.argv[2];

if (!username) {
    console.error('Usage: node makeAdmin.js <username>');
    process.exit(1);
}

makeAdmin(username);
