import { Request, Response } from "express";
import { Inquiry } from "../models/Inquiry.model.js";
import { sendEmail } from "../utils/email.js";

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
export const getInquiries = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, priority, limit, page } = req.query;

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: inquiries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private (Admin)
export const getInquiry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
      return;
    }

    // Mark as read if it's new
    if (inquiry.status === "new") {
      inquiry.status = "read";
      await inquiry.save();
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Create inquiry (contact form submission)
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("req :: ", req.body);

  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
    });

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.COMPANY_EMAIL || "intechhealthcare@gmail.com",
        subject: `New Inquiry: ${subject}`,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr />
          <p><small>Sent from Intech Healthcare website contact form</small></p>
        `,
      });
      console.log('✅ Admin notification email sent successfully');
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: `Thank you for contacting Intech Healthcare`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Intech Healthcare</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <p style="color: #374151;">Dear ${name},</p>
              <p style="color: #374151;">Thank you for contacting us. We have received your inquiry and will get back to you within 24 hours.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;"><strong>Your inquiry:</strong></p>
                <p style="color: #374151; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #374151; margin: 0;">${message}</p>
              </div>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Intech Healthcare | Plot No. 38/5-2, Jhagadia GIDC, Jhagadia<br/>
                dist. Bharuch-393110, GUJARAT, INDIA<br/>
                Email: intechhealthcare@gmail.com | Phone: +91 990 498 8839
              </p>
            </div>
          </div>
        `,
      });
      console.log('✅ User confirmation email sent successfully');
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Thank you for your inquiry. We will get back to you soon!",
      data: inquiry,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Update inquiry
// @route   PUT /api/inquiries/:id
// @access  Private (Admin)
export const updateInquiry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, priority, adminNotes } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
      return;
    }

    if (status) inquiry.status = status;
    if (priority) inquiry.priority = priority;
    if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;

    if (status === "responded" && !inquiry.respondedAt) {
      inquiry.respondedAt = new Date();
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
export const deleteInquiry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Reply to inquiry (send email to customer)
// @route   POST /api/inquiries/:id/reply
// @access  Private (Admin)
export const replyToInquiry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
      return;
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
      return;
    }

    // Send reply email to customer
    try {
      await sendEmail({
        to: inquiry.email,
        subject: `Re: ${inquiry.subject} - Intech Healthcare`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Intech Healthcare</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <p style="color: #374151;">Dear ${inquiry.name},</p>
              <p style="color: #374151;">Thank you for contacting Intech Healthcare. Here is our response to your inquiry:</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="color: #374151; white-space: pre-wrap; margin: 0;">${replyMessage}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 14px;"><strong>Your original inquiry:</strong></p>
              <p style="color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${inquiry.subject}</p>
              <p style="color: #6b7280; font-size: 14px; white-space: pre-wrap;">${inquiry.message}</p>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Intech Healthcare | Plot No. 38/5-2, Jhagadia GIDC, Jhagadia<br/>
                dist. Bharuch-393110, GUJARAT, INDIA<br/>
                Email: intechhealthcare@gmail.com | Phone: +91 990 498 8839
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send reply email:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send reply email. Please try again.",
      });
      return;
    }

    // Update inquiry status to responded
    inquiry.status = "responded";
    inquiry.respondedAt = new Date();
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: inquiry,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
