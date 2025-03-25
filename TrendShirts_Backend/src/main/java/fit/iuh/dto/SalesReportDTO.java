package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalRevenue;
    private long orderCount;
    private double averageOrderValue;
    private List<DailyRevenueDTO> dailyRevenue;
    private List<ProductSalesDTO> topProducts;
}