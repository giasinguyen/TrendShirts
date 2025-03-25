package fit.iuh.services;

import fit.iuh.dto.OrderDTO;
import fit.iuh.dto.OrderRequestDTO;
import fit.iuh.models.*;
import fit.iuh.repositories.AddressRepository;
import fit.iuh.repositories.OrderRepository;
import fit.iuh.repositories.ProductRepository;
import fit.iuh.repositories.UserRepository;
import fit.iuh.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;

    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Optional<OrderDTO> getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<OrderDTO> getCurrentUserOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return orderRepository.findByUserId(userDetails.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO createOrder(OrderRequestDTO orderRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address shippingAddress = addressRepository.findById(orderRequestDTO.getShippingAddressId())
                .orElseThrow(() -> new RuntimeException("Shipping address not found"));

        Address billingAddress = addressRepository.findById(orderRequestDTO.getBillingAddressId())
                .orElseThrow(() -> new RuntimeException("Billing address not found"));

        // Create new order
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentMethod(orderRequestDTO.getPaymentMethod());
        order.setPaymentId(orderRequestDTO.getPaymentId());

        // Process order items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequestDTO.OrderItemRequestDTO itemDTO : orderRequestDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSelectedSize(itemDTO.getSelectedSize());
            orderItem.setSelectedColor(itemDTO.getSelectedColor());

            orderItems.add(orderItem);

            // Calculate total
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        // Add shipping cost (example)
        BigDecimal shippingCost = new BigDecimal("5.99");
        order.setShippingCost(shippingCost);

        // Calculate tax (example: 10%)
        BigDecimal taxRate = new BigDecimal("0.10");
        BigDecimal taxAmount = total.multiply(taxRate);
        order.setTaxAmount(taxAmount);

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);

            // Update dates based on status
            switch (newStatus) {
                case PROCESSING -> order.setProcessedDate(LocalDateTime.now());
                case SHIPPED -> order.setShippedDate(LocalDateTime.now());
                case DELIVERED -> order.setDeliveredDate(LocalDateTime.now());
            }

            Order updatedOrder = orderRepository.save(order);
            return convertToDTO(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }
    }

    public boolean isOrderOwner(Long orderId, Object principal) {
        if (!(principal instanceof UserDetailsImpl userDetails)) {
            return false;
        }

        return orderRepository.findById(orderId)
                .map(order -> order.getUser().getId().equals(userDetails.getId()))
                .orElse(false);
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + new Random().nextInt(1000);
    }

    // Phương thức convertToDTO() để chuyển đổi từ entity sang DTO
    public OrderDTO convertToDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCreatedAt(order.getCreatedAt());

        // Thông tin người dùng
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserEmail(order.getUser().getEmail());
            dto.setUserName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        }

        // Thông tin tài chính
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingCost(order.getShippingCost());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setStatus(order.getStatus().name());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentId(order.getPaymentId());
        dto.setTrackingNumber(order.getTrackingNumber());

        // Thông tin thời gian
        dto.setOrderDate(order.getOrderDate());
        dto.setProcessedDate(order.getProcessedDate());
        dto.setShippedDate(order.getShippedDate());
        dto.setDeliveredDate(order.getDeliveredDate());

        // Địa chỉ giao hàng
        if (order.getShippingAddress() != null) {
            OrderDTO.AddressDTO shippingAddressDTO = new OrderDTO.AddressDTO();
            shippingAddressDTO.setId(order.getShippingAddress().getId());
            shippingAddressDTO.setStreetAddress(order.getShippingAddress().getStreetAddress());
            shippingAddressDTO.setCity(order.getShippingAddress().getCity());
            shippingAddressDTO.setState(order.getShippingAddress().getState());
            shippingAddressDTO.setPostalCode(order.getShippingAddress().getPostalCode());
            shippingAddressDTO.setCountry(order.getShippingAddress().getCountry());
            shippingAddressDTO.setPhoneNumber(order.getShippingAddress().getPhoneNumber());
            dto.setShippingAddress(shippingAddressDTO);
        }

        // Địa chỉ thanh toán
        if (order.getBillingAddress() != null) {
            OrderDTO.AddressDTO billingAddressDTO = new OrderDTO.AddressDTO();
            billingAddressDTO.setId(order.getBillingAddress().getId());
            billingAddressDTO.setStreetAddress(order.getBillingAddress().getStreetAddress());
            billingAddressDTO.setCity(order.getBillingAddress().getCity());
            billingAddressDTO.setState(order.getBillingAddress().getState());
            billingAddressDTO.setPostalCode(order.getBillingAddress().getPostalCode());
            billingAddressDTO.setCountry(order.getBillingAddress().getCountry());
            billingAddressDTO.setPhoneNumber(order.getBillingAddress().getPhoneNumber());
            dto.setBillingAddress(billingAddressDTO);
        }

        // Các sản phẩm trong đơn hàng
        if (order.getItems() != null) {
            List<OrderDTO.OrderItemDTO> itemDTOs = new ArrayList<>();

            for (OrderItem item : order.getItems()) {
                OrderDTO.OrderItemDTO itemDTO = new OrderDTO.OrderItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setPrice(item.getPrice());
                itemDTO.setSelectedSize(item.getSelectedSize());
                itemDTO.setSelectedColor(item.getSelectedColor());

                // Thông tin sản phẩm
                if (item.getProduct() != null) {
                    itemDTO.setProductId(item.getProduct().getId());
                    itemDTO.setProductName(item.getProduct().getName());

                    // Lấy hình ảnh chính nếu có
                    if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                        Optional<ProductImage> primaryImage = item.getProduct().getImages().stream()
                                .filter(ProductImage::isPrimary)
                                .findFirst();

                        primaryImage.ifPresent(image -> itemDTO.setProductImage(image.getUrl()));
                    }
                }

                itemDTOs.add(itemDTO);
            }

            dto.setItems(itemDTOs);
        }

        return dto;
    }
}