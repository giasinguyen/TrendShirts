package fit.iuh.repositories;

import fit.iuh.models.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Long> {
    // Sửa từ findByCategorySizeCategory thành findByCategory
    List<Size> findByCategory(Size.SizeCategory category);
    // Add findByName method
    Optional<Size> findByName(String name);
}