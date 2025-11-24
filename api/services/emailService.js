import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email templates
const emailTemplates = {
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Thank You for Your Order!</h2>
        <p>Hi ${user.username || 'Valued Customer'},</p>
        <p>We've received your order and it's being processed.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> R${order.amount.toFixed(2)}</p>
          <p><strong>Status:</strong> ${order.deliveryStatus}</p>
        </div>
        
        <p>You'll receive another email when your order ships.</p>
        <p>Thank you for shopping with JewelAura!</p>
      </div>
    `,
  }),

  orderShipped: (order, user) => ({
    subject: `Your Order Has Shipped - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Your Order is On Its Way! 📦</h2>
        <p>Hi ${user.username || 'Valued Customer'},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'Not available'}</p>
          <p><strong>Carrier:</strong> ${order.shippingCarrier || 'Standard Shipping'}</p>
          <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
        </div>
        
        <p>You can track your package using the tracking number above.</p>
        <p>Thank you for your patience!</p>
      </div>
    `,
  }),

  orderDelivered: (order, user) => ({
    subject: `Your Order Has Been Delivered - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Your Order Has Been Delivered! 🎉</h2>
        <p>Hi ${user.username || 'Valued Customer'},</p>
        <p>Your order has been successfully delivered.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Order Number:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Delivered On:</strong> ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
        </div>
        
        <p>We hope you love your purchase! Please take a moment to leave a review.</p>
        <p>If you have any issues, please contact our support team.</p>
      </div>
    `,
  }),

  returnRequested: (returnRequest, user) => ({
    subject: `Return Request Received - #${returnRequest._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Return Request Received</h2>
        <p>Hi ${user.username || 'Valued Customer'},</p>
        <p>We've received your return request and will review it shortly.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Return Request Number:</strong> #${returnRequest._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Order Number:</strong> #${returnRequest.orderId.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Reason:</strong> ${returnRequest.returnReason}</p>
          <p><strong>Status:</strong> ${returnRequest.status}</p>
        </div>
        
        <p>We'll send you an update within 24-48 hours.</p>
      </div>
    `,
  }),

  returnApproved: (returnRequest, user) => ({
    subject: `Return Approved - #${returnRequest._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Your Return Has Been Approved ✓</h2>
        <p>Hi ${user.username || 'Valued Customer'},</p>
        <p>Good news! Your return request has been approved.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Return Request Number:</strong> #${returnRequest._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Refund Amount:</strong> R${returnRequest.refundAmount?.toFixed(2) || '0.00'}</p>
          <p><strong>Refund Method:</strong> ${returnRequest.refundMethod}</p>
        </div>
        
        <p>Please ship the item(s) back to us. Once received, we'll process your refund within 5-7 business days.</p>
      </div>
    `,
  }),

  loyaltyPointsEarned: (points, user, totalPoints) => ({
    subject: `You Earned ${points} Loyalty Points! 🌟`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Congratulations! 🎉</h2>
        <p>Hi ${user.username || 'Valued Customer'},</p>
        <p>You've earned <strong>${points} loyalty points</strong> with your recent purchase!</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Total Points:</strong> ${totalPoints}</p>
          <p>Keep shopping to earn more rewards!</p>
        </div>
        
        <p>Visit your profile to see available rewards and redeem your points.</p>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data.order || data.returnRequest || data.points, data.user, data.totalPoints);

    const mailOptions = {
      from: process.env.EMAIL_FROM || `JewelAura <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
};

// Batch send emails
export const sendBulkEmails = async (recipients, template, data) => {
  const results = await Promise.allSettled(
    recipients.map((recipient) => sendEmail(recipient, template, data))
  );
  return results;
};

export default {
  sendEmail,
  sendBulkEmails,
};
