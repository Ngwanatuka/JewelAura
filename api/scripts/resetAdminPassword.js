// Script to reset admin user password
// Run this with: node scripts/resetAdminPassword.js <username> <new-password>

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import User from '../models/User.js';

dotenv.config();

const resetPassword = async (username, newPassword) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            console.error(`User "${username}" not found`);
            console.log('\nAvailable users:');
            const allUsers = await User.find({}, { username: 1, email: 1, isAdmin: 1 });
            allUsers.forEach(u => {
                console.log(`  - ${u.username} (${u.email}) ${u.isAdmin ? '[ADMIN]' : ''}`);
            });
            process.exit(1);
        }

        // Encrypt the new password
        const encryptedPassword = CryptoJS.AES.encrypt(
            newPassword,
            process.env.PASS_SEC
        ).toString();

        // Update password
        user.password = encryptedPassword;

        // Ensure user is admin
        if (!user.isAdmin) {
            user.isAdmin = true;
            console.log('Also setting user as admin...');
        }

        await user.save();

        console.log(`\n✅ Successfully reset password for "${username}"`);
        console.log('User details:', {
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        });
        console.log(`\n📝 New credentials:`);
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${newPassword}`);
        console.log('\n⚠️  You can now log in with these credentials!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Get arguments from command line
const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
    console.error('Usage: node resetAdminPassword.js <username> <new-password>');
    console.error('Example: node resetAdminPassword.js admin MyNewPassword123');
    process.exit(1);
}

resetPassword(username, newPassword);
