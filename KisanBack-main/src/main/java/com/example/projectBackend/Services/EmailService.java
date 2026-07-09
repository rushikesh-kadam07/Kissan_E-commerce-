package com.example.projectBackend.Services;

import com.example.projectBackend.Entity.Order;
import com.example.projectBackend.Entity.OrderItem;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendMail(String to, Long orderId) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, "UTF-8");

            setFrom(helper);
            helper.setTo(to);
            helper.setSubject("Order Confirmation - Order #" + orderId);
            helper.setText("Dear Customer,\n\nThank you for ordering from our site.\nYour order #" + orderId + " has been confirmed.", false);

            mailSender.send(msg);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email to {}", to, e);
        }
    }

    @Async
    public void sendInvoiceEmail(String to, String subject, String body) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, "UTF-8");

            setFrom(helper);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);

            mailSender.send(msg);
        } catch (Exception e) {
            logger.error("Failed to send email to {}", to, e);
        }
    }

    @Async
    public void sendInvoiceEmail(String to, byte[] pdf, Long orderId) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            setFrom(helper);
            helper.setTo(to);
            helper.setSubject("Invoice - Order #" + orderId);

            String html = """
                <div style="font-family:Arial;padding:20px">
                    <h2 style="color:#28a745">Order Placed</h2>
                    <p>Thank you for your purchase. Your invoice is attached.</p>
                    <div style="background:#f1f1f1;padding:15px;border-radius:8px">
                        <b>Order ID:</b> %d
                    </div>
                    <hr>
                    <small style="color:gray">This is an automated email.</small>
                </div>
            """.formatted(orderId);

            helper.setText(html, true);
            helper.addAttachment("invoice_" + orderId + ".pdf", new ByteArrayResource(pdf));

            mailSender.send(msg);
        } catch (Exception e) {
            logger.error("Failed to send invoice email for order {} to {}", orderId, to, e);
        }
    }

    @Async
    public void sendOrderInvoiceEmail(Order order, byte[] pdf) {
        if (order == null || order.getCustomer() == null || order.getCustomer().getEmail() == null) {
            logger.warn("Invoice email skipped because order/customer/email is missing");
            return;
        }

        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            setFrom(helper);
            helper.setTo(order.getCustomer().getEmail());
            helper.setSubject("Order Confirmation and Invoice - Order #" + order.getId());
            helper.setText(buildOrderEmailBody(order), true);
            helper.addAttachment("invoice_" + order.getId() + ".pdf", new ByteArrayResource(pdf));

            mailSender.send(msg);
            logger.info("Order invoice email sent for order {} to {}", order.getId(), order.getCustomer().getEmail());
        } catch (Exception e) {
            logger.error("Failed to send order invoice email for order {}", order.getId(), e);
        }
    }

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, "UTF-8");

            setFrom(helper);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);

            mailSender.send(msg);
        } catch (Exception e) {
            logger.error("Failed to send simple email to {}", to, e);
        }
    }

    public void sendOtp(String to, String otp) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, "UTF-8");

            setFrom(helper);
            helper.setTo(to);
            helper.setSubject("Your OTP for Password Reset");
            helper.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes. Do not share this OTP.", false);

            mailSender.send(msg);
            logger.info("Password reset OTP email sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}", to, e);
            throw new RuntimeException("Unable to send OTP email. Please check SMTP configuration and try again.", e);
        }
    }

    public void sendFarmerPasswordResetOtp(String to, String otp) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, "UTF-8");

            setFrom(helper);
            helper.setTo(to);
            helper.setSubject("Farmer Password Reset OTP");
            helper.setText("Your farmer account password reset OTP is: " + otp
                    + "\n\nThis OTP is valid for 5 minutes. Do not share this OTP.", false);

            mailSender.send(msg);
            logger.info("Farmer password reset OTP email sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send farmer OTP email to {}", to, e);
            throw new RuntimeException("Unable to send OTP email. Please check SMTP configuration and try again.", e);
        }
    }

    private void setFrom(MimeMessageHelper helper) throws Exception {
        if (fromEmail != null && !fromEmail.isBlank()) {
            helper.setFrom(fromEmail);
        }
    }

    private String buildOrderEmailBody(Order order) {
        String customerName = order.getCustomer().getName() != null ? order.getCustomer().getName() : "Customer";
        double total = order.getPayment() != null && order.getPayment().getNetAmount() != null
                ? order.getPayment().getNetAmount()
                : order.getTotalAmount();

        StringBuilder rows = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                rows.append("<tr>")
                        .append("<td style='padding:8px;border:1px solid #ddd'>").append(item.getProductName()).append("</td>")
                        .append("<td style='padding:8px;border:1px solid #ddd;text-align:center'>").append(item.getQuantity()).append("</td>")
                        .append("<td style='padding:8px;border:1px solid #ddd'>Rs. ").append(item.getPrice()).append("</td>")
                        .append("<td style='padding:8px;border:1px solid #ddd'>Rs. ").append(item.getTotal()).append("</td>")
                        .append("</tr>");
            }
        }

        return """
                <div style="font-family:Arial,sans-serif;color:#222">
                    <h2 style="color:#198754">Thank you for your order, %s</h2>
                    <p>Your order has been confirmed. Please find the invoice PDF attached.</p>
                    <p><b>Order ID:</b> %d</p>
                    <table style="border-collapse:collapse;width:100%%;max-width:680px">
                        <thead>
                            <tr style="background:#f4f4f4">
                                <th style="padding:8px;border:1px solid #ddd;text-align:left">Product</th>
                                <th style="padding:8px;border:1px solid #ddd">Qty</th>
                                <th style="padding:8px;border:1px solid #ddd;text-align:left">Price</th>
                                <th style="padding:8px;border:1px solid #ddd;text-align:left">Total</th>
                            </tr>
                        </thead>
                        <tbody>%s</tbody>
                    </table>
                    <h3>Total Amount: Rs. %.2f</h3>
                    <p>Regards,<br>Farmer Assist System</p>
                </div>
                """.formatted(customerName, order.getId(), rows, total);
    }
}
