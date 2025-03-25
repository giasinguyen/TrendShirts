package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private List<OrderItemRequestDTO> items = new ArrayList<>();
    private Long shippingAddressId;
    private Long billingAddressId;
    private String paymentMethod;
    private String paymentId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequestDTO {
        private Long productId;
        private int quantity;
        private String selectedSize;
        private String selectedColor;
    }
}