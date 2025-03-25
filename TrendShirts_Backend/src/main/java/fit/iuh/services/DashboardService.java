package fit.iuh.services;

import fit.iuh.dto.*;
import fit.iuh.models.Order;
import fit.iuh.models.Product;
import fit.iuh.models.User;
import fit.iuh.repositories.OrderRepository;
import fit.iuh.repositories.ProductRepository;
import fit.iuh.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final OrderService orderService;

    public DashboardStatsDTO getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();

        // Đếm đơn hàng theo trạng thái
        List<Map<String, Object>> orderStatusCounts = orderRepository.countOrdersByStatus();
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (Map<String, Object> result : orderStatusCounts) {
            ordersByStatus.put(
                    result.get("status").toString(),
                    ((Number) result.get("count")).longValue()
            );
        }

        // Doanh thu theo ngày
        List<Map<String, Object>> revenueByDayList = orderRepository.findRevenueByDayLast7Days();
        Map<String, BigDecimal> revenueByDay = new LinkedHashMap<>();
        for (Map<String, Object> data : revenueByDayList) {
            String date = data.get("date").toString();
            BigDecimal amount = (BigDecimal) data.get("amount");
            revenueByDay.put(date, amount);
        }

        long lowStockProductsCount = productRepository.countByStockQuantityLessThan(10);

        return new DashboardStatsDTO(
                totalRevenue,
                totalOrders,
                totalUsers,
                totalProducts,
                ordersByStatus,
                revenueByDay,
                lowStockProductsCount
        );
    }

    public List<ProductDTO> getLowStockProducts(int limit) {
        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThanOrderByStockQuantity(10, limit);
        return lowStockProducts.stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getRecentOrders(int limit) {
        List<Order> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc();
        return recentOrders.stream()
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Double> getSalesByCategory() {
        List<Object[]> results = orderRepository.findSalesByCategoryRaw();
        Map<String, Double> salesByCategory = new HashMap<>();

        for (Object[] result : results) {
            String category = (String) result[0];
            Double amount = ((BigDecimal) result[1]).doubleValue();
            salesByCategory.put(category, amount);
        }

        return salesByCategory;
    }

    public SalesReportDTO getSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusSeconds(1);

        List<Order> orders = orderRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (Order order : orders) {
            if (order.getTotalAmount() != null) {
                totalRevenue = totalRevenue.add(order.getTotalAmount());
            }
        }

        List<DailyRevenueDTO> dailyRevenue = orderRepository.findDailyRevenueBetweenDates(startDate, endDate);

        List<ProductSalesDTO> topProducts = orderRepository.findTopProductsBetweenDates(startDateTime, endDateTime, 10);

        return new SalesReportDTO(
                startDate,
                endDate,
                totalRevenue,
                orders.size(),
                orders.isEmpty() ? 0 : totalRevenue.doubleValue() / orders.size(),
                dailyRevenue,
                topProducts
        );
    }

    public Map<String, Long> getOrdersByStatus() {
        List<Map<String, Object>> results = orderRepository.countOrdersByStatus();
        Map<String, Long> ordersByStatus = new HashMap<>();

        for (Map<String, Object> result : results) {
            String status = result.get("status").toString();
            Long count = ((Number) result.get("count")).longValue();
            ordersByStatus.put(status, count);
        }

        return ordersByStatus;
    }

    public Map<String, Double> getRevenueLast7Days() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();

        Map<String, Double> result = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String formattedDate = date.format(formatter);
            result.put(formattedDate, 0.0);
        }

        List<Map<String, Object>> revenueData = orderRepository.findRevenueByDayLast7Days();
        for (Map<String, Object> data : revenueData) {
            String date = data.get("date").toString();
            Double amount = ((BigDecimal) data.get("amount")).doubleValue();
            result.put(date, amount);
        }

        return result;
    }

    public Map<String, Double> getRevenueByMonth() {
        List<Object[]> results = orderRepository.findRevenueByMonthLastYearRaw();
        Map<String, Double> revenueByMonth = new LinkedHashMap<>();

        for (Object[] result : results) {
            String yearMonth = (String) result[0];
            Double amount = ((BigDecimal) result[1]).doubleValue();
            revenueByMonth.put(yearMonth, amount);
        }

        return revenueByMonth;
    }

    public Map<String, Long> getNewUsers() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(30);

        Map<String, Long> result = new LinkedHashMap<>();
        for (int i = 30; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String formattedDate = date.format(formatter);
            result.put(formattedDate, 0L);
        }

        List<User> newUsers = userRepository.findByCreatedAtBetween(
                thirtyDaysAgo.atStartOfDay(),
                today.plusDays(1).atStartOfDay().minusSeconds(1)
        );

        Map<String, Long> usersByDate = newUsers.stream()
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt().toLocalDate().format(formatter),
                        Collectors.counting()
                ));

        usersByDate.forEach(result::put);

        return result;
    }

    public List<Map<String, Object>> getTopSellingProducts(int limit) {
        return orderRepository.findTopSellingProducts(limit);
    }
}