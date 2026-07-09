package com.example.projectBackend.Controller;

import com.example.projectBackend.DTO.ForgotPasswordRequest;
import com.example.projectBackend.DTO.LoginRequest;
import com.example.projectBackend.Entity.Customer;
import com.example.projectBackend.Services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService services;

//    @PostMapping
//    public ResponseEntity<Customer> save(@RequestBody Customer customer) {
//        Customer savedCustomer = services.Create(customer);
//        return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
//    }

    @PostMapping("/register")

    public ResponseEntity<?>Resgister(@RequestBody Customer customer){
        return services.Registration(customer);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        return services.login(request);
    }


    @GetMapping
    public ResponseEntity<List<Customer>> getData() {
        List customerList = services.getallCustomer();
        return new ResponseEntity<>(customerList, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Long id, @RequestBody Customer customer) {
        Customer updatedCustomer =services.updateCustomer(id,customer);
        return  new ResponseEntity<>(updatedCustomer,HttpStatus.OK);

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String>deleteCustomer(@PathVariable Long id){
        services.deletecustomer(id);
        return  new ResponseEntity<>("Customer deleted successfully",HttpStatus.OK);

    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(
            @RequestParam(required = false) String email,
            @RequestBody(required = false) ForgotPasswordRequest request) {

        services.sendOtp(resolveEmail(email, request));

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to email");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String otp,
            @RequestBody(required = false) ForgotPasswordRequest request) {

        services.verifyOtp(resolveEmail(email, request), resolveOtp(otp, request));

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP verified");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestBody(required = false) ForgotPasswordRequest request) {

        services.resetPassword(resolveEmail(email, request), resolvePassword(password, request));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully");

        return ResponseEntity.ok(response);
    }




    private String resolveEmail(String email, ForgotPasswordRequest request) {
        return email != null ? email : request != null ? request.getEmail() : null;
    }

    private String resolveOtp(String otp, ForgotPasswordRequest request) {
        return otp != null ? otp : request != null ? request.getOtp() : null;
    }

    private String resolvePassword(String password, ForgotPasswordRequest request) {
        return password != null ? password : request != null ? request.getPassword() : null;
    }
}

