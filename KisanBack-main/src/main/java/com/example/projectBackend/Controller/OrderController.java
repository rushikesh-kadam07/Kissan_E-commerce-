package com.example.projectBackend.Controller;

import com.example.projectBackend.DTO.OrderRequestDTO;
import com.example.projectBackend.Entity.Order;
import com.example.projectBackend.Services.FarmerSevices;
import com.example.projectBackend.Services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")

public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private FarmerSevices farmerSevices;


    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequestDTO dto) {
        return orderService.placeOrder(dto);
    }

    @GetMapping("/{customerId}/customer")
    public ResponseEntity<?> getOrderByCustomer(@PathVariable Long customerId) {
        return orderService.getOrderByCustomer(customerId);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId) {
        Order order = orderService.cancleOrder(orderId);
        return ResponseEntity.ok(order);
    }


    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        List<Order> allOrders = orderService.getAllOrders();
        return ResponseEntity.ok(allOrders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = orderService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        List<String> allCities = orderService.getAllCities();
        return ResponseEntity.ok(allCities);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Order>> filterOrders(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String city
    ) {
        List<Order> filters = orderService.filters(from, to, city);
        return ResponseEntity.ok(filters);
    }
//
//        // farmer orders
//    @GetMapping("/farmer/{farmerId}")
//    public ResponseEntity<List<Order>> getOrdersByFarmer(
//            @PathVariable Long farmerId) {
//
//        List<Order> orders = orderService.getOrdersByFarmer(farmerId);
//
//        return ResponseEntity.ok(orders);
//    }
//
//        //farmer Dashboard
//    @GetMapping("/farmer/{farmerId}")
//    public ResponseEntity<?> getFarmerDashboard(
//            @PathVariable Long farmerId) {
//
//        return ResponseEntity.ok(
//                farmerSevices.getFarmerDashboard(farmerId));
//    }
//


    // ================= FARMER ORDERS =================
    @GetMapping("/farmer/{farmerId}/orders")
    public ResponseEntity<List<Order>> getOrdersByFarmer(
            @PathVariable Long farmerId) {

        List<Order> orders =
                orderService.getOrdersByFarmer(farmerId);

        return ResponseEntity.ok(orders);
    }


    // ================= FARMER DASHBOARD =================
    @GetMapping("/farmer/{farmerId}/dashboard")
    public ResponseEntity<?> getFarmerDashboard(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                farmerSevices.getFarmerDashboard(farmerId));
    }
}



