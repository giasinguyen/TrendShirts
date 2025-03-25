package fit.iuh.repositories;

import fit.iuh.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByType(Category.CategoryType type);
    List<Category> findByParentId(Long parentId);
    List<Category> findByParentIsNull();
    Optional<Category> findByNameAndType(String name, Category.CategoryType type);
}