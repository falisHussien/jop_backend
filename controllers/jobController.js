const { sendEmail } = require('../services/emailService');

const applyForJob = async (req, res) => {
  try {
    // Extract applicant's email from request body
    const { email, jobTitle } = req.body;

    // Send confirmation email
    await sendEmail(email, 'Job Application Received', `Thank you for applying for ${jobTitle}. We will review your application soon.`);

    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply for job' });
  }
};

module.exports = { applyForJob };
