package com.example.projectBackend.Services;

import com.example.projectBackend.DTO.LoginRequest;
import com.example.projectBackend.Entity.Customer;
import com.example.projectBackend.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository repo;

    @Autowired
    private  EmailService emailService;

    @Autowired
    private  OtpServices otpService;


//    public Customer Create(Customer customer) {
//
//        return repo.save(customer);

    public ResponseEntity<?>Registration(Customer customer){
        Optional<Customer> byEmail = repo.findByEmail(customer.getEmail());

        if (byEmail.isPresent()){
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }
        Customer save =repo.save(customer);
        customer.setPassword(null);
        return ResponseEntity.ok(save);

    }
    public List<Customer> getallCustomer(){
        return repo.findAll();
    }

    public Customer updateCustomer(Long id,Customer customer){
        Customer exist =repo.findById(id).get();
        exist.setName(customer.getName());
        exist.setCity(customer.getCity());
        exist.setContact(customer.getContact());
        exist.setEmail(customer.getEmail());
        exist.setAddress(customer.getAddress());
        exist.setPassword(customer.getPassword());
        return repo.save(exist);

    }
    public void deletecustomer(Long id){
        if (repo.existsById(id)){
            repo.deleteById(id);
        } else {
            throw new RuntimeException("Customer not found");
        }
    }

    public ResponseEntity<?> login(LoginRequest request){
        Optional<Customer> byEmail = repo.findByEmail(request.getEmail());
        if(byEmail.isPresent()){
            Customer customer = byEmail.get();
            if(customer.getPassword().equals(request.getPassword())){
                customer.setPassword(null); // hide password
                return ResponseEntity.ok(customer);
            }
            return ResponseEntity.status(401).body("Invalid username password");
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
    public ResponseEntity<?> logins(LoginRequest request){
        Optional<Customer> byEmail = repo.findByEmail(request.getEmail());
        if(byEmail.isPresent()){
            Customer customer = byEmail.get();
            if(customer.getPassword().equals(request.getPassword())){
                customer.setPassword(null); // hide password
                return ResponseEntity.ok(customer);
            }
            return ResponseEntity.status(401).body("Invalid username password");
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    public void sendOtp(String email) {
        validateEmail(email);

        repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        String otp = otpService.generateOtp(email);

        try {
            emailService.sendOtp(email, otp);
        } catch (RuntimeException e) {
            otpService.clearOtp(email);
            throw e;
        }
    }

    public void verifyOtp(String email, String otp) {
        validateEmail(email);
        if (otp == null || otp.isBlank()) {
            throw new RuntimeException("OTP is required");
        }

        boolean isValid = otpService.verifyOtp(email, otp);

        if (!isValid) {
            throw new RuntimeException("Invalid OTP");
        }
    }

    public void resetPassword(String email, String newPassword) {
        validateEmail(email);
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        Customer user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!otpService.isOtpVerified(email)) {
            throw new RuntimeException("Please verify OTP before resetting password");
        }

        user.setPassword(newPassword); // later use encoder
        repo.save(user);

        otpService.clearOtp(email); // cleanup
    }



    private void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }
    }
}
