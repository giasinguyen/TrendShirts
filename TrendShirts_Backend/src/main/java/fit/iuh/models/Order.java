package fit.iuh.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;

    @ManyToOne
    @JoinColumn(name = "billing_address_id")
    private Address billingAddress;

    private BigDecimal totalAmount; // Tổng tiền hàng
    private BigDecimal shippingCost; // Phí vận chuyển
    private BigDecimal taxAmount; // Thuế

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String paymentMethod;
    private String paymentId;
    private String trackingNumber;

    private LocalDateTime orderDate; // Ngày đặt hàng
    private LocalDateTime processedDate; // Ngày xử lý
    private LocalDateTime shippedDate; // Ngày gửi hàng
    private LocalDateTime deliveredDate; // Ngày giao hàng
    private LocalDateTime createdAt; // Ngày tạo (cho phân tích)

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        orderDate = LocalDateTime.now();
        if (status == null) {
            status = OrderStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // Cập nhật thời gian khi thay đổi trạng thái
        if (status == OrderStatus.PROCESSING && processedDate == null) {
            processedDate = LocalDateTime.now();
        } else if (status == OrderStatus.SHIPPED && shippedDate == null) {
            shippedDate = LocalDateTime.now();
        } else if (status == OrderStatus.DELIVERED && deliveredDate == null) {
            deliveredDate = LocalDateTime.now();
        }
    }

    public enum OrderStatus {
        PENDING,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        COMPLETED,
        CANCELLED,
        REFUNDED
    }

    // Cập nhật tổng tiền dựa trên các item
    public void calculateTotalAmount() {
        BigDecimal itemsTotal = BigDecimal.ZERO;
        for (OrderItem item : items) {
            BigDecimal itemPrice = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemsTotal = itemsTotal.add(itemPrice);
        }

        this.totalAmount = itemsTotal;

        // Cập nhật thuế và phí vận chuyển nếu chúng chưa được đặt
        if (this.shippingCost == null) {
            this.shippingCost = BigDecimal.ZERO;
        }

        if (this.taxAmount == null) {
            this.taxAmount = BigDecimal.ZERO;
        }
    }

    // Thêm item vào đơn hàng
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
        calculateTotalAmount();
    }

    // Xóa item khỏi đơn hàng
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
        calculateTotalAmount();
    }
}