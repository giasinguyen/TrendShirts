package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userEmail;
    private String userName;
    private List<OrderItemDTO> items = new ArrayList<>();
    private AddressDTO shippingAddress;
    private AddressDTO billingAddress;
    private BigDecimal totalAmount;
    private BigDecimal shippingCost;
    private BigDecimal taxAmount;
    private String status;
    private String paymentMethod;
    private String paymentId;
    private String trackingNumber;
    private LocalDateTime orderDate;
    private LocalDateTime processedDate;
    private LocalDateTime shippedDate;
    private LocalDateTime deliveredDate;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private int quantity;
        private BigDecimal price;
        private String selectedSize;
        private String selectedColor;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDTO {
        private Long id;
        private String streetAddress;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private String phoneNumber;
    }
}