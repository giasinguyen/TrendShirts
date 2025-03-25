package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterDTO {
    private Long categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String search;
    private List<String> sizes;
    private List<String> colors;
    private Boolean featured;
    private Boolean newArrival;
    private String sortBy;
    private String sortDirection;
}