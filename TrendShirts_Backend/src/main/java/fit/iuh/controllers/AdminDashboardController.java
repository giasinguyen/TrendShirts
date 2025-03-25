package fit.iuh.controllers;

import fit.iuh.dto.*;
import fit.iuh.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/sales-report")
    public ResponseEntity<SalesReportDTO> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dashboardService.getSalesReport(startDate, endDate));
    }

    @GetMapping("/low-stock-products")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts() {
        return ResponseEntity.ok(dashboardService.getLowStockProducts(10));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<OrderDTO>> getRecentOrders() {
        return ResponseEntity.ok(dashboardService.getRecentOrders(10));
    }

    @GetMapping("/sales-by-category")
    public ResponseEntity<Map<String, Double>> getSalesByCategory() {
        return ResponseEntity.ok(dashboardService.getSalesByCategory());
    }

    @GetMapping("/orders-by-status")
    public ResponseEntity<Map<String, Long>> getOrdersByStatus() {
        return ResponseEntity.ok(dashboardService.getOrdersByStatus());
    }

    @GetMapping("/revenue-last-7-days")
    public ResponseEntity<Map<String, Double>> getRevenueLast7Days() {
        return ResponseEntity.ok(dashboardService.getRevenueLast7Days());
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<Map<String, Double>> getRevenueByMonth() {
        return ResponseEntity.ok(dashboardService.getRevenueByMonth());
    }

    @GetMapping("/new-users")
    public ResponseEntity<Map<String, Long>> getNewUsers() {
        return ResponseEntity.ok(dashboardService.getNewUsers());
    }

    @GetMapping("/top-selling-products")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts() {
        return ResponseEntity.ok(dashboardService.getTopSellingProducts(5));
    }
}