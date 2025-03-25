package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private Long id;
    private String url;
    private boolean primary;

    // Optional: Additional fields if needed
    private String altText;
    private Integer displayOrder;
}