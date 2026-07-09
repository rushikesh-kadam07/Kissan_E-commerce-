package com.example.projectBackend.Services;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServices {

    private static final long OTP_VALIDITY_MILLIS = 5 * 60 * 1000;

    private final SecureRandom secureRandom = new SecureRandom();
    private final ConcurrentHashMap<String, String> otpStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> expiryStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Boolean> verifiedStore = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String key = normalize(email);
        String otp = String.valueOf(secureRandom.nextInt(900000) + 100000);
        otpStore.put(key, otp);
        expiryStore.put(key, System.currentTimeMillis() + OTP_VALIDITY_MILLIS);
        verifiedStore.remove(key);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String key = normalize(email);
        Long expiry = expiryStore.get(key);

        if (expiry == null || System.currentTimeMillis() > expiry) {
            clearOtp(key);
            return false;
        }

        boolean valid = otp != null && otp.equals(otpStore.get(key));
        if (valid) {
            verifiedStore.put(key, true);
        }
        return valid;
    }

    public boolean isOtpVerified(String email) {
        String key = normalize(email);
        Long expiry = expiryStore.get(key);
        return Boolean.TRUE.equals(verifiedStore.get(key))
                && expiry != null
                && System.currentTimeMillis() <= expiry;
    }

    public void clearOtp(String email) {
        String key = normalize(email);
        otpStore.remove(key);
        expiryStore.remove(key);
        verifiedStore.remove(key);


    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }


}
