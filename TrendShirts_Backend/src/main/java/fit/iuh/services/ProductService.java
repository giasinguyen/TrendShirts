package fit.iuh.services;

import fit.iuh.dto.ProductDTO;
import fit.iuh.dto.ProductImageDTO;
import fit.iuh.models.*;
import fit.iuh.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final ProductImageRepository productImageRepository;

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        // Find products in this category and all its child categories (if any)
        List<Long> categoryIds = new ArrayList<>();
        categoryIds.add(categoryId);

        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            categoryIds.addAll(
                    category.getChildren().stream()
                            .map(Category::getId)
                            .collect(Collectors.toList())
            );
        }

        Page<Product> products = productRepository.findByCategoryIdIn(categoryIds, pageable);
        return products.map(this::convertToDTO);
    }

    public Page<ProductDTO> searchProducts(String search, Pageable pageable) {
        Page<Product> products = productRepository.findByNameContainingOrDescriptionContaining(
                search, search, pageable);
        return products.map(this::convertToDTO);
    }

    public List<ProductDTO> getFeaturedProducts() {
        List<Product> products = productRepository.findByFeaturedTrueOrderByCreatedAtDesc();
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ProductDTO> getNewArrivals() {
        List<Product> products = productRepository.findByNewArrivalTrueOrderByCreatedAtDesc();
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();

        // Set basic properties
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setSku(productDTO.getSku());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setMaterial(productDTO.getMaterial());
        product.setFeatured(productDTO.isFeatured());
        product.setNewArrival(productDTO.isNewArrival());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Set category
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategoryId()));
        product.setCategory(category);

        // Set colors
        if (productDTO.getColorIds() != null && !productDTO.getColorIds().isEmpty()) {
            Set<Color> colors = productDTO.getColorIds().stream()
                    .map(colorId -> colorRepository.findById(colorId)
                            .orElseThrow(() -> new RuntimeException("Color not found with id: " + colorId)))
                    .collect(Collectors.toSet());
            product.setAvailableColors(colors);
        }

        // Set sizes
        if (productDTO.getSizeIds() != null && !productDTO.getSizeIds().isEmpty()) {
            Set<Size> sizes = productDTO.getSizeIds().stream()
                    .map(sizeId -> sizeRepository.findById(sizeId)
                            .orElseThrow(() -> new RuntimeException("Size not found with id: " + sizeId)))
                    .collect(Collectors.toSet());
            product.setAvailableSizes(sizes);
        }

        // Save the product first to get ID
        Product savedProduct = productRepository.save(product);

        // Handle product images
        if (productDTO.getImages() != null && !productDTO.getImages().isEmpty()) {
            Set<ProductImage> images = new HashSet<>();

            for (ProductImageDTO imageDTO : productDTO.getImages()) {
                ProductImage image = new ProductImage();
                image.setProduct(savedProduct);
                image.setUrl(imageDTO.getUrl());
                image.setPrimary(imageDTO.isPrimary());
                image.setAltText(imageDTO.getAltText());

                ProductImage savedImage = productImageRepository.save(image);
                images.add(savedImage);
            }

            savedProduct.setImages(images);
        }

        return convertToDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update basic properties
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setSku(productDTO.getSku());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setMaterial(productDTO.getMaterial());
        product.setFeatured(productDTO.isFeatured());
        product.setNewArrival(productDTO.isNewArrival());
        product.setUpdatedAt(LocalDateTime.now());

        // Update category if provided
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategoryId()));
            product.setCategory(category);
        }

        // Update colors if provided
        if (productDTO.getColorIds() != null) {
            Set<Color> colors = productDTO.getColorIds().stream()
                    .map(colorId -> colorRepository.findById(colorId)
                            .orElseThrow(() -> new RuntimeException("Color not found with id: " + colorId)))
                    .collect(Collectors.toSet());
            product.setAvailableColors(colors);
        }

        // Update sizes if provided
        if (productDTO.getSizeIds() != null) {
            Set<Size> sizes = productDTO.getSizeIds().stream()
                    .map(sizeId -> sizeRepository.findById(sizeId)
                            .orElseThrow(() -> new RuntimeException("Size not found with id: " + sizeId)))
                    .collect(Collectors.toSet());
            product.setAvailableSizes(sizes);
        }

        // Handle product images
        if (productDTO.getImages() != null) {
            // First, remove images that are not in the DTO
            if (product.getImages() != null) {
                Set<Long> dtoImageIds = productDTO.getImages().stream()
                        .filter(img -> img.getId() != null)
                        .map(ProductImageDTO::getId)
                        .collect(Collectors.toSet());

                List<ProductImage> imagesToDelete = product.getImages().stream()
                        .filter(img -> !dtoImageIds.contains(img.getId()))
                        .collect(Collectors.toList());

                if (!imagesToDelete.isEmpty()) {
                    productImageRepository.deleteAll(imagesToDelete);
                    product.getImages().removeAll(imagesToDelete);
                }
            }

            // Then, add new images or update existing ones
            if (product.getImages() == null) {
                product.setImages(new HashSet<>());
            }

            for (ProductImageDTO imageDTO : productDTO.getImages()) {
                if (imageDTO.getId() == null) {
                    // This is a new image
                    ProductImage newImage = new ProductImage();
                    newImage.setProduct(product);
                    newImage.setUrl(imageDTO.getUrl());
                    newImage.setPrimary(imageDTO.isPrimary());
                    newImage.setAltText(imageDTO.getAltText());

                    ProductImage savedImage = productImageRepository.save(newImage);
                    product.getImages().add(savedImage);
                } else {
                    // This is an existing image, update it
                    product.getImages().stream()
                            .filter(img -> img.getId().equals(imageDTO.getId()))
                            .findFirst()
                            .ifPresent(img -> {
                                img.setUrl(imageDTO.getUrl());
                                img.setPrimary(imageDTO.isPrimary());
                                img.setAltText(imageDTO.getAltText());
                                productImageRepository.save(img);
                            });
                }
            }
        }

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    @Transactional
    public ProductDTO updateStock(Long id, Integer stockQuantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setStockQuantity(stockQuantity);
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Delete all related images first
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            productImageRepository.deleteAll(product.getImages());
        }

        productRepository.delete(product);
    }

    public List<ProductDTO> findByStockQuantityLessThan(int threshold, int limit) {
        List<Product> products = productRepository.findByStockQuantityLessThanOrderByStockQuantity(threshold, limit);
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Helper method to convert Product entity to DTO
    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setSku(product.getSku());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setMaterial(product.getMaterial());
        dto.setFeatured(product.isFeatured());
        dto.setNewArrival(product.isNewArrival());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // Category information
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        // Colors
        if (product.getAvailableColors() != null) {
            dto.setColorIds(product.getAvailableColors().stream()
                    .map(Color::getId)
                    .collect(Collectors.toSet()));

            dto.setColors(product.getAvailableColors().stream()
                    .map(color -> {
                        ProductDTO.ColorInfo colorInfo = new ProductDTO.ColorInfo();
                        colorInfo.setId(color.getId());
                        colorInfo.setName(color.getName());
                        colorInfo.setHexCode(color.getHexCode());
                        return colorInfo;
                    })
                    .collect(Collectors.toList()));
        }

        // Sizes
        if (product.getAvailableSizes() != null) {
            dto.setSizeIds(product.getAvailableSizes().stream()
                    .map(Size::getId)
                    .collect(Collectors.toSet()));

            dto.setSizes(product.getAvailableSizes().stream()
                    .map(size -> {
                        ProductDTO.SizeInfo sizeInfo = new ProductDTO.SizeInfo();
                        sizeInfo.setId(size.getId());
                        sizeInfo.setName(size.getName());
                        sizeInfo.setDescription(size.getDescription());
                        return sizeInfo;
                    })
                    .collect(Collectors.toList()));
        }

        // Images
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setImages(product.getImages().stream()
                    .map(image -> {
                        ProductImageDTO imageDTO = new ProductImageDTO();
                        imageDTO.setId(image.getId());
                        imageDTO.setUrl(image.getUrl());
                        imageDTO.setPrimary(image.isPrimary());
                        imageDTO.setAltText(image.getAltText());
                        return imageDTO;
                    })
                    .collect(Collectors.toList()));

            // Set primary image URL
            product.getImages().stream()
                    .filter(ProductImage::isPrimary)
                    .findFirst()
                    .ifPresent(image -> dto.setPrimaryImage(image.getUrl()));
        }

        return dto;
    }
}