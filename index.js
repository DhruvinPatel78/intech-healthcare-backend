const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Load environment variables from server/.env
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error("Error loading .env file:", result.error);
  } else {
    console.log("✓ Environment variables loaded from:", envPath);
  }
} else {
  console.warn("⚠️  .env file not found at:", envPath);
  // Try loading from root as fallback
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow specific origins only
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['https://develop--intechhealthcare.netlify.app/', 'https://intechhealthcare.com/']; // Default for local development

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Create transporter for SMTP
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // Debug logging
  console.log("SMTP Configuration:");
  console.log("  Host:", smtpHost || "NOT SET");
  console.log("  Port:", smtpPort);
  console.log("  User:", smtpUser ? `${smtpUser.substring(0, 3)}***` : "NOT SET");
  console.log("  Password:", smtpPassword ? "***SET***" : "NOT SET");

  // Validate SMTP configuration
  if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error(
      "SMTP configuration is missing. Please check your .env file. " +
      `Host: ${smtpHost ? "✓" : "✗"}, User: ${smtpUser ? "✓" : "✗"}, Password: ${smtpPassword ? "✓" : "✗"}`
    );
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    // Add connection timeout and retry options
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Success",
  });
});

// API endpoint for sending quote request email
app.post("/api/send-quote-request", async (req, res) => {
  try {
    const { email, quantity, grade, productName } = req.body;
    console.log(email, quantity, grade, productName);

    // Validate required fields
    if (!email || !quantity || !grade || !productName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const transporter = createTransporter();

    // Email content for company
    const companyMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.COMPANY_EMAIL || process.env.SMTP_USER,
      subject: `New Quote Request - ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Quote Request</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Product Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Grade:</strong> ${grade}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This quote request was submitted through the Intech Healthcare website.
          </p>
        </div>
      `,
    };

    // Email content for customer (confirmation)
    const customerMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Quote Request Received - ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Your Quote Request</h2>
          <p>Dear Customer,</p>
          <p>We have received your quote request for <strong>${productName}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Request Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Grade:</strong> ${grade}</p>
          </div>
          <p>Our team will review your request and get back to you shortly.</p>
          <p>If you have any questions, please feel free to contact us at:</p>
          <p>
            <strong>Email:</strong> intechhealthcare@gmail.com<br>
            <strong>Phone:</strong> +91 990 498 8839
          </p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>Intech Healthcare</strong>
          </p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({
      success: true,
      message: "Quote request sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send quote request. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// API endpoint for sending contact form message
app.post("/api/send-contact-message", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const transporter = createTransporter();

    // Email content for company
    const companyMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.COMPANY_EMAIL || process.env.SMTP_USER,
      subject: `New Contact Form Message - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Message</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #d1d5db;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; color: #374151;">${message}</p>
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This message was submitted through the Intech Healthcare website contact form.
          </p>
        </div>
      `,
    };

    // Email content for customer (confirmation)
    const customerMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Thank You for Contacting Intech Healthcare`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Contacting Us</h2>
          <p>Dear ${name},</p>
          <p>We have received your message regarding <strong>${subject}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Message</h3>
            <p style="white-space: pre-wrap; color: #374151;">${message}</p>
          </div>
          <p>Our team will review your message and get back to you shortly.</p>
          <p>If you have any urgent questions, please feel free to contact us at:</p>
          <p>
            <strong>Email:</strong> intechhealthcare@gmail.com<br>
            <strong>Phone:</strong> +91 990 498 8839
          </p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>Intech Healthcare</strong>
          </p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({
      success: true,
      message: "Contact message sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`SMTP Host: ${process.env.SMTP_HOST || "NOT SET"}`);
  console.log(`SMTP User: ${process.env.SMTP_USER || "NOT SET"}`);
  console.log(`Company Email: ${process.env.COMPANY_EMAIL || process.env.SMTP_USER || "NOT SET"}`);
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn("\n⚠️  WARNING: SMTP configuration is incomplete!");
    console.warn("Please create a .env file in the server directory with your SMTP settings.");
    console.warn("See server/env.example for reference.\n");
  }
});

