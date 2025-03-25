package fit.iuh.services;

import fit.iuh.dto.CategoryDTO;
import fit.iuh.models.Category;
import fit.iuh.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<CategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<CategoryDTO> getCategoriesByType(String type) {
        try {
            Category.CategoryType categoryType = Category.CategoryType.valueOf(type.toUpperCase());
            return categoryRepository.findByType(categoryType)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid category type: " + type);
        }
    }

    public List<CategoryDTO> getSubcategories(Long parentId) {
        return categoryRepository.findByParentId(parentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getMainCategories() {
        return categoryRepository.findByParentIsNull()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setType(category.getType().name());

        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }

        List<CategoryDTO> subcategories = category.getChildren()
                .stream()
                .map(this::convertToSimpleDTO) // Use simple conversion to avoid infinite recursion
                .collect(Collectors.toList());

        dto.setSubcategories(subcategories);

        return dto;
    }

    private CategoryDTO convertToSimpleDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setType(category.getType().name());

        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }

        return dto;
    }
}