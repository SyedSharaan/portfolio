const nodemailer = require('nodemailer');
require('dotenv').config();

exports.handler = async function(event, context) {
    try {
        const data = JSON.parse(event.body);
        console.log("Received data:", data); // Debugging

        if (!data.email || !data.name || !data.message) {
            throw new Error("❌ Missing required fields: name, email, message");
        }

        // Step 1: Configure Nodemailer with your email provider
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Use 'Outlook', 'Yahoo', or SMTP for custom domains
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email app password
            }
        });
        console.log("transporter", transporter)

        // Step 2: Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Change this to where you want to receive emails
            subject: "New Contact from Portfolio",
            text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`
        };
        console.log("mailOptions", mailOptions)

        // Step 3: Send Email
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully!"})
        };
    } catch (error) {
        console.error("❌ ERROR:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error sending email!", error: error.toString() })
        };
    }
};