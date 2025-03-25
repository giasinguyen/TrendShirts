package fit.iuh.repositories;

import fit.iuh.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByCategoryIdIn(List<Long> categoryIds, Pageable pageable);

    Page<Product> findByNameContainingOrDescriptionContaining(String name, String description, Pageable pageable);

    List<Product> findByFeaturedTrueOrderByCreatedAtDesc();

    List<Product> findByNewArrivalTrueOrderByCreatedAtDesc();

    long countByStockQuantityLessThan(int threshold);

    List<Product> findByStockQuantityLessThanOrderByStockQuantity(int threshold, Pageable pageable);

    default List<Product> findByStockQuantityLessThanOrderByStockQuantity(int threshold, int limit) {
        return findByStockQuantityLessThanOrderByStockQuantity(threshold, PageRequest.of(0, limit));
    }
}