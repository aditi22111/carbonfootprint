const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const { calculateFootprint } = require('../utils/CalculateFootprint');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists. Please login.', success: false });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

      
        const jwtToken = jwt.sign(
            { id: user._id, name: user.name }, 
            process.env.JWT_SECRET,  
            { expiresIn: '300h' }
        );

        res.status(201).json({ message: 'Signup successful', success: true, jwtToken, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403).json({ message: 'Invalid email or password', success: false });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(403).json({ message: 'Invalid email or password', success: false });

        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '40h' });

        res.status(200).json({ message: 'Login successful', success: true, token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { phone, distanceToOffice, vehicleType, fuelType, commuteMethod, energyUsage, diet, recycling, consent, date, userId } = req.body;

        // Use the userId as email to find the user
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: userId }, // Search by email (userId)
            {
                phone,
                distanceToOffice,
                vehicleType,
                fuelType,
                commuteMethod,
                energyUsage,
                diet,
                recycling,
                consent,
                date
            },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: `User with email ${userId} not found`, success: false });
        }

        res.status(200).json({ message: 'User details updated successfully', success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user details:', error); // Log the error details
        res.status(500).json({ message: 'Internal server error', success: false, error: error.message }); // Return the error message for better visibility
    }
};


const getDashboard = async (req, res) => {
    try {
        const { email } = req.user; // Use email from decoded JWT attached by ensureAuthenticated

        // Fetch user data from the database
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found`, success: false });
        }

        // Calculate footprint data if requested
        const footprintData = calculateFootprint(user);
        const totalFootprint = footprintData.totalFootprint || 0;
        const monthlyFootprint = (totalFootprint / 12).toFixed(2);
        const yearlyFootprint = totalFootprint.toFixed(2);

        res.status(200).json({
            message: 'Dashboard data retrieved successfully',
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                distanceToOffice: user.distanceToOffice,
                vehicleType: user.vehicleType,
                fuelType: user.fuelType,
                commuteMethod: user.commuteMethod,
                energyUsage: user.energyUsage,
                diet: user.diet,
                recycling: user.recycling,
                consent: user.consent,
                date: user.date,
                monthlyFootprint,
                yearlyFootprint,
            }
        });
    } catch (error) {
        console.error('Error retrieving dashboard data:', error);
        res.status(500).json({ message: 'Internal server error', success: false, error: error.message });
    }
};


const calculateFootprintHandler = async (req, res) => {
    try {
        const { distanceToOffice, vehicleType, fuelType, energyUsage } = req.body; // Expect these parameters in request body
        const totalFootprint = calculateFootprint(distanceToOffice, vehicleType, fuelType, energyUsage);
        res.status(200).json({ totalFootprint });
    } catch (error) {
        console.error('Error calculating footprint:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = { signup, login, updateUserDetails, getDashboard , calculateFootprintHandler };