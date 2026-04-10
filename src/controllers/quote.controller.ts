import { Request, Response } from 'express';
import { Quote } from '../models/Quote.model.js';
import { sendEmail } from '../utils/email.js';

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private (Admin)
export const getQuotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit, page } = req.query;

    // Build query
    const query: any = {};
    if (status) query.status = status;

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const quotes = await Quote.find(query)
      .populate('productId', 'name composition')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: quotes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private (Admin)
export const getQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await Quote.findById(req.params.id).populate(
      'productId',
      'name composition'
    );

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create quote request
// @route   POST /api/quotes
// @access  Public
export const createQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      productName,
      customerName,
      email,
      phone,
      company,
      quantity,
      country,
      message,
    } = req.body;

    // Validate required fields
    if (!productId || !productName || !customerName || !email || !phone || !quantity || !country) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
      return;
    }

    // Create quote
    const quote = await Quote.create({
      productId,
      productName,
      customerName,
      email,
      phone,
      company,
      quantity,
      country,
      message,
    });

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.COMPANY_EMAIL || 'intechhealthcare@gmail.com',
        subject: `New Quote Request: ${productName}`,
        html: `
          <h2>New Quote Request</h2>
          <h3>Product: ${productName}</h3>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Country:</strong> ${country}</p>
          ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
          <hr />
          <p><small>Sent from Intech Healthcare product quote form</small></p>
        `,
      });
      console.log('✅ Admin quote notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to customer
    try {
      await sendEmail({
        to: email,
        subject: `Quote Request Received - ${productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Intech Healthcare</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <p style="color: #374151;">Dear ${customerName},</p>
              <p style="color: #374151;">Thank you for your interest in our products. We have received your quote request and will respond within 24 hours.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;"><strong>Quote Request Details:</strong></p>
                <p style="color: #374151; margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
                <p style="color: #374151; margin: 5px 0;"><strong>Quantity:</strong> ${quantity}</p>
                <p style="color: #374151; margin: 5px 0;"><strong>Country:</strong> ${country}</p>
                ${message ? `<p style="color: #374151; margin: 5px 0;"><strong>Message:</strong> ${message}</p>` : ''}
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
      console.log('✅ Customer quote confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully. We will contact you soon!',
      data: quote,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update quote
// @route   PUT /api/quotes/:id
// @access  Private (Admin)
export const updateQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, adminNotes, quotedPrice } = req.body;

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
      return;
    }

    if (status) quote.status = status;
    if (adminNotes !== undefined) quote.adminNotes = adminNotes;
    if (quotedPrice !== undefined) quote.quotedPrice = quotedPrice;

    if (status === 'quoted' && !quote.quotedAt) {
      quote.quotedAt = new Date();
    }

    await quote.save();

    res.status(200).json({
      success: true,
      message: 'Quote updated successfully',
      data: quote,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private (Admin)
export const deleteQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Reply to quote request (send email to customer)
// @route   POST /api/quotes/:id/reply
// @access  Private (Admin)
export const replyToQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      res.status(400).json({
        success: false,
        message: 'Reply message is required',
      });
      return;
    }

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
      return;
    }

    // Send reply email to customer
    try {
      await sendEmail({
        to: quote.email,
        subject: `Re: Quote Request for ${quote.productName} - Intech Healthcare`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Intech Healthcare</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <p style="color: #374151;">Dear ${quote.customerName},</p>
              <p style="color: #374151;">Thank you for your interest in our products. Here is our response to your quote request:</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="color: #374151; white-space: pre-wrap; margin: 0;">${replyMessage}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 14px;"><strong>Your original quote request:</strong></p>
              <p style="color: #6b7280; font-size: 14px;"><strong>Product:</strong> ${quote.productName}</p>
              <p style="color: #6b7280; font-size: 14px;"><strong>Quantity:</strong> ${quote.quantity}</p>
              <p style="color: #6b7280; font-size: 14px;"><strong>Country:</strong> ${quote.country}</p>
              ${quote.message ? `<p style="color: #6b7280; font-size: 14px;"><strong>Your message:</strong> ${quote.message}</p>` : ''}
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
      console.error('Failed to send reply email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send reply email. Please try again.',
      });
      return;
    }

    // Update quote status to quoted if not already
    if (quote.status === 'pending') {
      quote.status = 'quoted';
      quote.quotedAt = new Date();
    }
    await quote.save();

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: quote,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

