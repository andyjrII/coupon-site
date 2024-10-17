const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.postDetails = async (req, res) => {
  const { name, email, phone, location } = req.body;
  try {
    // Check if user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // Create new user record
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        location: location,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'User details submitted successfully!',
      user: newUser, // Include the newly created user in the response
    });
  } catch (error) {
    console.error('Error submitting user details:', error);
    return res.status(500).json({
      success: false,
      message: 'There was an error submitting the details.',
    });
  }
};

exports.postCoupon = async (req, res) => {
  const { userId, doorId } = req.body;

  // Convert userId to an integer
  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId)) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid user ID.' });
  }

  function getRandomPercentage() {
    const random = Math.random();
    if (random < 0.9) {
      return Math.floor(Math.random() * 10) + 1; // 90% chance for 1-20%
    } else {
      return Math.floor(Math.random() * 20) + 31; // 10% chance for 21-50%
    }
  }

  function generateCouponCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const discount = getRandomPercentage();
  const couponCode = generateCouponCode();
  const expirationDate = new Date(); // Current date
  expirationDate.setDate(expirationDate.getDate() + 10); // Add 10 days for expiration

  try {
    // Save coupon with expiration date
    await prisma.coupon.create({
      data: {
        userId: parsedUserId, // Use the parsed integer userId
        discount: discount,
        code: couponCode,
        expiration: expirationDate,
      },
    });

    res.send({
      success: true,
      discount: discount,
      couponCode: couponCode,
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res
      .status(500)
      .send({ success: false, message: 'Failed to create coupon.' });
  }
};
