package com.example.projectBackend.Services;

import com.example.projectBackend.DTO.LoginRequest;
import com.example.projectBackend.Entity.Farmer;
import com.example.projectBackend.Entity.Order;
import com.example.projectBackend.Repository.FarmerRepository;
import com.example.projectBackend.Repository.OrderRepository;
import com.example.projectBackend.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FarmerSevices {

    @Autowired
    private FarmerRepository repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpServices otpService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<?> create(Farmer farmer) {
        Optional<Farmer> byUserName = repo.findByEmail(farmer.getEmail());
        if (byUserName.isPresent()) {
            return ResponseEntity.badRequest().body("Username Already Existed");
        }
        if (farmer.getPassword() == null || farmer.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        farmer.setPassword(passwordEncoder.encode(farmer.getPassword()));
        Farmer save = repo.save(farmer);
        save.setPassword(null);
        return ResponseEntity.ok(save);

    }

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        Optional<Farmer> byUserName = repo.findByEmail(loginRequest.getEmail());
        // System.out.println(byUserName.get());
        if (byUserName.isPresent()) {
            Farmer admin1 = byUserName.get();
            if (isPasswordValid(loginRequest.getPassword(), admin1.getPassword())) {
                admin1.setPassword(null);
                return ResponseEntity.ok(admin1);
            }
            return ResponseEntity.status(401).body("Invalid UserName Password ");

        }
        return ResponseEntity.status(401).body("Invalid Usename Password");

    }

    public void sendOtp(String email) {
        validateEmail(email);

        repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        String otp = otpService.generateOtp(otpKey(email));

        try {
            emailService.sendFarmerPasswordResetOtp(email, otp);
        } catch (RuntimeException e) {
            otpService.clearOtp(otpKey(email));
            throw e;
        }
    }

    public void verifyOtp(String email, String otp) {
        validateEmail(email);
        if (otp == null || !otp.matches("\\d{6}")) {
            throw new RuntimeException("Valid 6 digit OTP is required");
        }

        if (!otpService.verifyOtp(otpKey(email), otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }

    public void resetPassword(String email, String newPassword) {
        validateEmail(email);
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        Farmer farmer = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if (!otpService.isOtpVerified(otpKey(email))) {
            throw new RuntimeException("Please verify OTP before resetting password");
        }

        farmer.setPassword(passwordEncoder.encode(newPassword));
        repo.save(farmer);
        otpService.clearOtp(otpKey(email));
    }

    private boolean isPasswordValid(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null) {
            return false;
        }
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return storedPassword.equals(rawPassword);
    }

    private void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }
    }

    private String otpKey(String email) {
        return "farmer:" + email;
    }


// ================= FARMER DASHBOARD =================

    public Map<String, Object> getFarmerDashboard(Long farmerId) {

        List<Order> orders =
                orderRepository.findOrdersByFarmerId(farmerId)
                        .stream()
                        .distinct()
                        .toList();

        Map<String, Object> data = new HashMap<>();

        // ================= TOTAL ORDERS =================
        data.put("totalOrders", orders.size());

        // ================= TOTAL CUSTOMERS =================
        long totalCustomers = orders.stream()
                .map(o -> o.getCustomer().getId())
                .distinct()
                .count();

        data.put("totalCustomers", totalCustomers);

        // ================= TOTAL PRODUCTS =================
        long totalProducts =
                productRepository.countProductsByFarmer(farmerId);

        data.put("totalProducts", totalProducts);

        // ================= TOTAL REVENUE =================
        double revenue = orders.stream()
                .filter(o -> o.getPayment() != null)
                .filter(o ->
                        "SUCCESS".equalsIgnoreCase(
                                o.getPayment().getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        data.put("totalRevenue", revenue);

        // ================= STATUS COUNTS =================

        data.put("confirmed",
                orders.stream()
                        .filter(o ->
                                "CONFIRMED".equalsIgnoreCase(
                                        o.getStatus()))
                        .count());

        data.put("inProcess",
                orders.stream()
                        .filter(o ->
                                "IN_PROCESS".equalsIgnoreCase(
                                        o.getStatus()))
                        .count());

        data.put("dispatch",
                orders.stream()
                        .filter(o ->
                                "DISPATCH".equalsIgnoreCase(
                                        o.getStatus()))
                        .count());

        data.put("delivered",
                orders.stream()
                        .filter(o ->
                                "DELIVERED".equalsIgnoreCase(
                                        o.getStatus()))
                        .count());

        data.put("cancelled",
                orders.stream()
                        .filter(o ->
                                "CANCELLED".equalsIgnoreCase(
                                        o.getStatus()))
                        .count());

        // ================= PAYMENT STATUS =================

        long paid = orders.stream()
                .filter(o -> o.getPayment() != null)
                .filter(o ->
                        "SUCCESS".equalsIgnoreCase(
                                o.getPayment().getStatus()))
                .count();

        data.put("paid", paid);

        long pendingPayments = orders.stream()
                .filter(o -> o.getPayment() != null)
                .filter(o ->
                        "PENDING".equalsIgnoreCase(
                                o.getPayment().getStatus()))
                .count();

        data.put("pendingPayments", pendingPayments);

        long refunded = orders.stream()
                .filter(o -> o.getPayment() != null)
                .filter(o ->
                        "REFUNDED".equalsIgnoreCase(
                                o.getPayment().getStatus()))
                .count();

        data.put("refundPayments", refunded);

        return data;
    }
}

