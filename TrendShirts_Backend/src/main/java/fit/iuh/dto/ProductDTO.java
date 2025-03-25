package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;
    private Integer stockQuantity;
    private String material;
    private boolean featured;
    private boolean newArrival;

    private Long categoryId;
    private String categoryName;

    private Set<Long> colorIds;
    private List<ColorInfo> colors;

    private Set<Long> sizeIds;
    private List<SizeInfo> sizes;

    private List<ProductImageDTO> images;
    private String primaryImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColorInfo {
        private Long id;
        private String name;
        private String hexCode;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SizeInfo {
        private Long id;
        private String name;
        private String description;
    }
}