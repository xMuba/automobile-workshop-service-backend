import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


// @desc    Register new customer
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { phone, email, password, name, address } = req.body;

    if (!phone || !password || !name) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone, password and name are required',
      });
    }

    const userExists = await prisma.user.findUnique({ where: { phone } });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this phone number',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Transaction: link to existing customer or create new one
    const { customer, user } = await prisma.$transaction(async (tx) => {
      // Check if receptionist already added this customer
      let customer = await tx.customer.findFirst({ where: { phone } });

      if (!customer) {
        // Brand new customer — create profile
        customer = await tx.customer.create({
          data: {
            name,
            phone,
            email: email || null,
            address: address || null,
          },
        });
      } else {
        // Existing customer — optionally update name/email if provided
        customer = await tx.customer.update({
          where: { customer_id: customer.customer_id },
          data: {
            ...(name && { name }),
            ...(email !== undefined && { email: email || null }),
            ...(address !== undefined && { address: address || null }),
          },
        });
      }

      const user = await tx.user.create({
        data: {
          phone,
          email: email || null,
          password: hashedPassword,
          role: 'CUSTOMER',
          customer_id: customer.customer_id,
        },
        include: { customer: true },
      });

      return { customer, user };
    });

    const token = generateToken(user.user_id);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          user_id: user.user_id,
          phone: user.phone,
          email: user.email,
          role: user.role,
          customer_id: user.customer_id,
          customer,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error during registration',
    });
  }
};
// @desc    Login with password
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { customer: true, employee: true },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated',
      });
    }

    const token = generateToken(user.user_id);

    res.json({
      status: 'success',
      data: {
        user: {
          user_id: user.user_id,
          phone: user.phone,
          email: user.email,
          role: user.role,
          customer_id: user.customer_id,
          employee_id: user.employee_id,
          customer: user.customer,
          employee: user.employee,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Request OTP
// @route   POST /api/auth/otp/request
export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone is required',
      });
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { otp, otp_expires },
    });

    // TODO: integrate SMS service (Twilio, etc.)
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      status: 'success',
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/otp/verify
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone and OTP are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { customer: true, employee: true },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP',
      });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({
        status: 'error',
        message: 'OTP expired',
      });
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { otp: null, otp_expires: null },
    });

    const token = generateToken(user.user_id);

    res.json({
      status: 'success',
      data: {
        user: {
          user_id: user.user_id,
          phone: user.phone,
          email: user.email,
          role: user.role,
          customer_id: user.customer_id,
          employee_id: user.employee_id,
          customer: user.customer,
          employee: user.employee,
        },
        token,
      },
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.user_id },
      include: { customer: true, employee: true },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          user_id: user.user_id,
          phone: user.phone,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
          customer_id: user.customer_id,
          employee_id: user.employee_id,
          customer: user.customer,
          employee: user.employee,
        },
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};