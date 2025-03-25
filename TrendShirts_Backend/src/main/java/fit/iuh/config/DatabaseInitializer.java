package fit.iuh.config;

import fit.iuh.models.*;
import fit.iuh.repositories.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DatabaseInitializer {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initialize() {
        // Tách các phương thức thành các transaction riêng biệt
        createRolesIfNotExist();
        createAdminUserIfNotExist();
        createCategoriesIfNotExist();
        createColorsIfNotExist();
        createSizesIfNotExist();
        createSampleProductsIfNotExist();
    }

    @Transactional
    public void createRolesIfNotExist() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(Role.RoleName.ROLE_USER);
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName(Role.RoleName.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }
    }

    @Transactional
    public void createAdminUserIfNotExist() {
        if (!userRepository.existsByEmail("admin@trendshirts.com")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            User adminUser = new User();
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setEmail("admin@trendshirts.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRoles(Set.of(adminRole));

            userRepository.save(adminUser);
        }
    }

    @Transactional
    public void createCategoriesIfNotExist() {
        if (categoryRepository.count() == 0) {
            // Parent categories
            Category men = new Category();
            men.setName("Men");
            men.setDescription("Men's clothing collection");
            men.setType(Category.CategoryType.MEN);
            categoryRepository.save(men);

            Category women = new Category();
            women.setName("Women");
            women.setDescription("Women's clothing collection");
            women.setType(Category.CategoryType.WOMEN);
            categoryRepository.save(women);

            Category accessories = new Category();
            accessories.setName("Accessories");
            accessories.setDescription("Accessories collection");
            accessories.setType(Category.CategoryType.ACCESSORIES);
            categoryRepository.save(accessories);

            // Men's subcategories
            createSubcategory("T-Shirts", "Men's T-shirts collection", men);
            createSubcategory("Shirts", "Men's shirts collection", men);
            createSubcategory("Pants", "Men's pants collection", men);
            createSubcategory("Jackets", "Men's jackets collection", men);

            // Women's subcategories
            createSubcategory("Dresses", "Women's dresses collection", women);
            createSubcategory("Tops", "Women's tops collection", women);
            createSubcategory("Skirts", "Women's skirts collection", women);
            createSubcategory("Pants", "Women's pants collection", women);

            // Accessories subcategories
            createSubcategory("Hats", "Hats collection", accessories);
            createSubcategory("Bags", "Bags collection", accessories);
            createSubcategory("Jewelry", "Jewelry collection", accessories);
        }
    }

    private void createSubcategory(String name, String description, Category parent) {
        Category subcategory = new Category();
        subcategory.setName(name);
        subcategory.setDescription(description);
        subcategory.setParent(parent);
        subcategory.setType(parent.getType());
        categoryRepository.save(subcategory);
    }

    @Transactional
    public void createColorsIfNotExist() {
        if (colorRepository.count() == 0) {
            List<Color> colors = new ArrayList<>();
            colors.add(createColor("Black", "#000000"));
            colors.add(createColor("White", "#FFFFFF"));
            colors.add(createColor("Red", "#FF0000"));
            colors.add(createColor("Blue", "#0000FF"));
            colors.add(createColor("Green", "#00FF00"));
            colors.add(createColor("Yellow", "#FFFF00"));
            colors.add(createColor("Purple", "#800080"));
            colors.add(createColor("Pink", "#FFC0CB"));
            colors.add(createColor("Gray", "#808080"));
            colors.add(createColor("Brown", "#A52A2A"));

            colorRepository.saveAll(colors);
        }
    }

    private Color createColor(String name, String hexCode) {
        Color color = new Color();
        color.setName(name);
        color.setHexCode(hexCode);
        return color;
    }

    @Transactional
    public void createSizesIfNotExist() {
        if (sizeRepository.count() == 0) {
            List<Size> sizes = new ArrayList<>();

            // Men's sizes
            sizes.add(createSize("S", "Small", Size.SizeCategory.MENS));
            sizes.add(createSize("M", "Medium", Size.SizeCategory.MENS));
            sizes.add(createSize("L", "Large", Size.SizeCategory.MENS));
            sizes.add(createSize("XL", "Extra Large", Size.SizeCategory.MENS));
            sizes.add(createSize("XXL", "Double Extra Large", Size.SizeCategory.MENS));

            // Women's sizes
            sizes.add(createSize("XS", "Extra Small", Size.SizeCategory.WOMENS));
            sizes.add(createSize("S", "Small", Size.SizeCategory.WOMENS));
            sizes.add(createSize("M", "Medium", Size.SizeCategory.WOMENS));
            sizes.add(createSize("L", "Large", Size.SizeCategory.WOMENS));
            sizes.add(createSize("XL", "Extra Large", Size.SizeCategory.WOMENS));

            // Unisex size
            sizes.add(createSize("ONE SIZE", "One Size Fits All", Size.SizeCategory.UNISEX));

            // Lưu tất cả một lần
            sizeRepository.saveAll(sizes);
        }
    }

    private Size createSize(String name, String description, Size.SizeCategory category) {
        Size size = new Size();
        size.setName(name);
        size.setDescription(description);
        size.setCategory(category);
        return size;
    }

    @Transactional
    public void createSampleProductsIfNotExist() {
        if (productRepository.count() == 0) {
            // Fetch categories
            Category menTShirts = categoryRepository.findByNameAndType("T-Shirts", Category.CategoryType.MEN)
                    .orElseThrow(() -> new RuntimeException("Men's T-Shirts category not found"));

            Category womenDresses = categoryRepository.findByNameAndType("Dresses", Category.CategoryType.WOMEN)
                    .orElseThrow(() -> new RuntimeException("Women's Dresses category not found"));

            // Fetch all colors and sizes first to make sure they exist
            List<Color> allColors = colorRepository.findAll();
            if (allColors.isEmpty()) {
                throw new RuntimeException("No colors found in the database");
            }
            Map<String, Color> colorMap = new HashMap<>();
            for (Color color : allColors) {
                colorMap.put(color.getName(), color);
            }

            // Fetch all sizes
            List<Size> allSizes = sizeRepository.findAll();
            if (allSizes.isEmpty()) {
                throw new RuntimeException("No sizes found in the database");
            }

            // Create maps to easily find sizes by category and name
            Map<String, Size> menSizeMap = new HashMap<>();
            Map<String, Size> womenSizeMap = new HashMap<>();

            for (Size size : allSizes) {
                if (size.getCategory() == Size.SizeCategory.MENS) {
                    menSizeMap.put(size.getName(), size);
                } else if (size.getCategory() == Size.SizeCategory.WOMENS) {
                    womenSizeMap.put(size.getName(), size);
                }
            }

            // Check that we have the necessary sizes
            if (menSizeMap.isEmpty() || !menSizeMap.containsKey("S") || !menSizeMap.containsKey("M") || !menSizeMap.containsKey("L")) {
                throw new RuntimeException("Missing required men's sizes");
            }

            if (womenSizeMap.isEmpty() || !womenSizeMap.containsKey("S") || !womenSizeMap.containsKey("M") || !womenSizeMap.containsKey("L")) {
                throw new RuntimeException("Missing required women's sizes");
            }

            // Create men's t-shirts with explicit sizes
            Product menTShirt1 = new Product();
            menTShirt1.setName("Classic White T-Shirt");
            menTShirt1.setDescription("A classic white t-shirt made from 100% organic cotton");
            menTShirt1.setPrice(new BigDecimal("29.99"));
            menTShirt1.setSku("TS-M-001");
            menTShirt1.setStockQuantity(100);
            menTShirt1.setCategory(menTShirts);
            menTShirt1.setMaterial("100% Organic Cotton");
            menTShirt1.setFeatured(true);
            menTShirt1.setNewArrival(false);

            // Add color - White
            Set<Color> menTShirt1Colors = new HashSet<>();
            menTShirt1Colors.add(colorMap.get("White"));
            menTShirt1.setAvailableColors(menTShirt1Colors);

            // Add sizes - S, M, L
            Set<Size> menTShirt1Sizes = new HashSet<>();
            menTShirt1Sizes.add(menSizeMap.get("S"));
            menTShirt1Sizes.add(menSizeMap.get("M"));
            menTShirt1Sizes.add(menSizeMap.get("L"));
            menTShirt1.setAvailableSizes(menTShirt1Sizes);

            // Save product
            productRepository.save(menTShirt1);

            // Create another men's t-shirt
            Product menTShirt2 = new Product();
            menTShirt2.setName("Graphic Print T-Shirt");
            menTShirt2.setDescription("A stylish graphic print t-shirt with modern design");
            menTShirt2.setPrice(new BigDecimal("34.99"));
            menTShirt2.setSku("TS-M-002");
            menTShirt2.setStockQuantity(80);
            menTShirt2.setCategory(menTShirts);
            menTShirt2.setMaterial("95% Cotton, 5% Elastane");
            menTShirt2.setFeatured(false);
            menTShirt2.setNewArrival(true);

            // Add colors - Black, Blue
            Set<Color> menTShirt2Colors = new HashSet<>();
            menTShirt2Colors.add(colorMap.get("Black"));
            menTShirt2Colors.add(colorMap.get("Blue"));
            menTShirt2.setAvailableColors(menTShirt2Colors);

            // Add sizes - M, L
            Set<Size> menTShirt2Sizes = new HashSet<>();
            menTShirt2Sizes.add(menSizeMap.get("M"));
            menTShirt2Sizes.add(menSizeMap.get("L"));
            menTShirt2.setAvailableSizes(menTShirt2Sizes);

            // Save product
            productRepository.save(menTShirt2);

            // Create women's dress
            Product womenDress1 = new Product();
            womenDress1.setName("Summer Floral Dress");
            womenDress1.setDescription("A beautiful floral dress perfect for summer days");
            womenDress1.setPrice(new BigDecimal("89.99"));
            womenDress1.setSku("DR-W-001");
            womenDress1.setStockQuantity(50);
            womenDress1.setCategory(womenDresses);
            womenDress1.setMaterial("100% Viscose");
            womenDress1.setFeatured(true);
            womenDress1.setNewArrival(true);

            // Add colors - Pink, Yellow
            Set<Color> womenDress1Colors = new HashSet<>();
            womenDress1Colors.add(colorMap.get("Pink"));
            womenDress1Colors.add(colorMap.get("Yellow"));
            womenDress1.setAvailableColors(womenDress1Colors);

            // Add sizes - XS, S, M
            Set<Size> womenDress1Sizes = new HashSet<>();
            womenDress1Sizes.add(womenSizeMap.get("XS"));
            womenDress1Sizes.add(womenSizeMap.get("S"));
            womenDress1Sizes.add(womenSizeMap.get("M"));
            womenDress1.setAvailableSizes(womenDress1Sizes);

            // Save product
            productRepository.save(womenDress1);

            // Create another women's dress
            Product womenDress2 = new Product();
            womenDress2.setName("Elegant Evening Dress");
            womenDress2.setDescription("An elegant dress for special occasions");
            womenDress2.setPrice(new BigDecimal("129.99"));
            womenDress2.setSku("DR-W-002");
            womenDress2.setStockQuantity(30);
            womenDress2.setCategory(womenDresses);
            womenDress2.setMaterial("80% Polyester, 20% Elastane");
            womenDress2.setFeatured(true);
            womenDress2.setNewArrival(false);

            // Add colors - Black, Purple
            Set<Color> womenDress2Colors = new HashSet<>();
            womenDress2Colors.add(colorMap.get("Black"));
            womenDress2Colors.add(colorMap.get("Purple"));
            womenDress2.setAvailableColors(womenDress2Colors);

            // Add sizes - S, M, L
            Set<Size> womenDress2Sizes = new HashSet<>();
            womenDress2Sizes.add(womenSizeMap.get("S"));
            womenDress2Sizes.add(womenSizeMap.get("M"));
            womenDress2Sizes.add(womenSizeMap.get("L"));
            womenDress2.setAvailableSizes(womenDress2Sizes);

            // Save product
            productRepository.save(womenDress2);
        }
    }
}