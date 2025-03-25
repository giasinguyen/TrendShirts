package fit.iuh.repositories;

import fit.iuh.dto.DailyRevenueDTO;
import fit.iuh.dto.ProductSalesDTO;
import fit.iuh.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);

    // Tìm đơn hàng trong khoảng thời gian
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Tìm 10 đơn hàng gần đây nhất
    List<Order> findTop10ByOrderByCreatedAtDesc();

    // Đếm số đơn hàng trong khoảng thời gian
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    long countOrdersBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Tính tổng doanh thu trong khoảng thời gian
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalAmountBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Tính tổng doanh thu của toàn bộ cửa hàng
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    // Đếm số lượng đơn hàng theo trạng thái
    @Query("SELECT o.status as status, COUNT(o) as count FROM Order o GROUP BY o.status")
    List<Map<String, Object>> countOrdersByStatus();

    // Doanh thu theo ngày trong 7 ngày gần đây
    @Query(value = "SELECT DATE(o.created_at) as date, COALESCE(SUM(o.total_amount), 0) as amount " +
            "FROM orders o " +
            "WHERE o.status = 'COMPLETED' AND o.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) " +
            "GROUP BY DATE(o.created_at) " +
            "ORDER BY date",
            nativeQuery = true)
    List<Map<String, Object>> findRevenueByDayLast7Days();

    // Doanh thu theo ngày trong khoảng thời gian
    @Query(value = "SELECT NEW fit.iuh.dto.DailyRevenueDTO(" +
            "CAST(o.createdAt AS java.time.LocalDate), " +
            "COALESCE(SUM(o.totalAmount), 0), " +
            "COUNT(o)) " +
            "FROM Order o " +
            "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY CAST(o.createdAt AS java.time.LocalDate) " +
            "ORDER BY CAST(o.createdAt AS java.time.LocalDate)")
    List<DailyRevenueDTO> findDailyRevenueBetweenDates(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Doanh thu theo danh mục sản phẩm
    @Query(value = "SELECT c.name as category, COALESCE(SUM(oi.price * oi.quantity), 0) as amount " +
            "FROM orders o " +
            "JOIN order_items oi ON o.id = oi.order_id " +
            "JOIN products p ON oi.product_id = p.id " +
            "JOIN categories c ON p.category_id = c.id " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY c.name",
            nativeQuery = true)
    List<Object[]> findSalesByCategoryRaw();

    // Top sản phẩm bán chạy trong khoảng thời gian
    @Query(value = "SELECT NEW fit.iuh.dto.ProductSalesDTO(" +
            "p.id, p.name, SUM(oi.quantity), SUM(oi.price * oi.quantity)) " +
            "FROM Order o " +
            "JOIN o.items oi " +
            "JOIN oi.product p " +
            "WHERE o.createdAt BETWEEN :startDate AND :endDate AND o.status = 'COMPLETED' " +
            "GROUP BY p.id, p.name " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<ProductSalesDTO> findTopProductsBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    // Overload method với limit
    default List<ProductSalesDTO> findTopProductsBetweenDates(
            LocalDateTime startDate,
            LocalDateTime endDate,
            int limit) {
        return findTopProductsBetweenDates(startDate, endDate, Pageable.ofSize(limit));
    }

    // Doanh thu theo tháng trong 12 tháng gần đây
    @Query(value = "SELECT CONCAT(YEAR(o.created_at), '-', LPAD(MONTH(o.created_at), 2, '0')) as yearMonth, " +
            "COALESCE(SUM(o.total_amount), 0) as amount " +
            "FROM orders o " +
            "WHERE o.status = 'COMPLETED' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) " +
            "GROUP BY YEAR(o.created_at), MONTH(o.created_at) " +
            "ORDER BY YEAR(o.created_at), MONTH(o.created_at)",
            nativeQuery = true)
    List<Object[]> findRevenueByMonthLastYearRaw();

    // Top sản phẩm bán chạy
    @Query(value = "SELECT p.id as productId, p.name as productName, " +
            "SUM(oi.quantity) as quantitySold, " +
            "SUM(oi.price * oi.quantity) as revenue " +
            "FROM orders o " +
            "JOIN order_items oi ON o.id = oi.order_id " +
            "JOIN products p ON oi.product_id = p.id " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY p.id, p.name " +
            "ORDER BY quantitySold DESC " +
            "LIMIT :limit",
            nativeQuery = true)
    List<Map<String, Object>> findTopSellingProducts(@Param("limit") int limit);
}