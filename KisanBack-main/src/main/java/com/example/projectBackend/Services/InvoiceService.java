package com.example.projectBackend.Services;

import com.example.projectBackend.Entity.Order;
import com.example.projectBackend.Entity.OrderItem;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        try {
            Document doc = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, out);

            doc.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
            Paragraph title = new Paragraph("Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            doc.add(title);

            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Order ID: " + order.getId()));
            doc.add(new Paragraph("Date: " + order.getOrderDate()));
            doc.add(new Paragraph("Customer: " + order.getCustomer().getName()));
            doc.add(new Paragraph("Email: " + order.getCustomer().getEmail()));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4, 1, 2, 2});

            addHeaderCell(table, "Product");
            addHeaderCell(table, "Qty");
            addHeaderCell(table, "Price");
            addHeaderCell(table, "Total");

            for (OrderItem item : order.getItems()) {
                table.addCell(item.getProductName());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell("Rs. " + item.getPrice());
                table.addCell("Rs. " + item.getTotal());
            }

            doc.add(table);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Subtotal: Rs. " + order.getTotalAmount()));

            if (order.getPayment() != null) {
                doc.add(new Paragraph("GST: Rs. " + order.getPayment().getGstAmount()));
                doc.add(new Paragraph("Discount: Rs. " + order.getPayment().getDiscountAmount()));
                doc.add(new Paragraph("Final: Rs. " + order.getPayment().getNetAmount()));
                if ("COD".equals(order.getPayment().getPaymentMethod())) {
                    doc.add(new Paragraph(" "));
                    doc.add(new Paragraph("Pay Mode: " + order.getPayment().getPaymentMethod()));
                    doc.add(new Paragraph("Payment should be paid at doorstep before receiving the order."));
                }
            }

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Invoice generation failed", e);
        }
    }

    private void addHeaderCell(PdfPTable table, String value) {
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD);
        PdfPCell cell = new PdfPCell(new Paragraph(value, headerFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }
}
