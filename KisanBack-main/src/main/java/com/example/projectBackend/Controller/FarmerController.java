package com.example.projectBackend.Controller;

import com.example.projectBackend.DTO.LoginRequest;
import com.example.projectBackend.DTO.ForgotPasswordRequest;
import com.example.projectBackend.Entity.Farmer;
import com.example.projectBackend.Services.FarmerSevices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "*")
public class FarmerController {
    @Autowired
    private FarmerSevices services;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Farmer farmer) {
        return services.create(farmer);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return services.login(loginRequest);

    }


}


//    @PostMapping("/send-otp")
//    public ResponseEntity<Map<String, String>> sendOtp(
//            @RequestParam(required = false) String email,
//            @RequestBody(required = false) ForgotPasswordRequest request) {
//
//        services.sendOtp(resolveEmail(email, request));
//        return message("OTP sent to registered email");
//    }

//    @PostMapping("/verify-otp")
//    public ResponseEntity<Map<String, String>> verifyOtp(
//            @RequestParam(required = false) String email,
//            @RequestParam(required = false) String otp,
//            @RequestBody(required = false) ForgotPasswordRequest request) {
//
//        services.verifyOtp(resolveEmail(email, request), resolveOtp(otp, request));
//        return message("OTP verified");
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<Map<String, String>> resetPassword(
//            @RequestParam(required = false) String email,
//            @RequestParam(required = false) String password,
//            @RequestBody(required = false) ForgotPasswordRequest request) {
//
//        services.resetPassword(resolveEmail(email, request), resolvePassword(password, request));
//        return message("Password updated successfully");
//    }

//    private ResponseEntity<Map<String, String>> message(String value) {
//        Map<String, String> response = new HashMap<>();
//        response.put("message", value);
//        return ResponseEntity.ok(response);
//    }
//
//    private String resolveEmail(String email, ForgotPasswordRequest request) {
//        return email != null ? email : request != null ? request.getEmail() : null;
//    }
//
//    private String resolveOtp(String otp, ForgotPasswordRequest request) {
//        return otp != null ? otp : request != null ? request.getOtp() : null;
//    }
//
//    private String resolvePassword(String password, ForgotPasswordRequest request) {
//        return password != null ? password : request != null ? request.getPassword() : null;
//    }
//}
