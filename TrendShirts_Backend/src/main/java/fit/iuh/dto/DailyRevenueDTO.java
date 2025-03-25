package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenueDTO {
    private LocalDate date;
    private BigDecimal revenue;
    private long orderCount;
}