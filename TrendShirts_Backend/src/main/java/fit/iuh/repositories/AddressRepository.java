package fit.iuh.repositories;

import fit.iuh.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
    List<Address> findByUserIdAndIsDefaultTrue(Long userId);

    // Thay thế phương thức tìm theo AddressType
    // List<Address> findByUserIdAndType(Long userId, Address.AddressType type);

    // Có thể thay bằng các phương thức sau:
    default List<Address> findShippingAddresses(Long userId) {
        return findByUserId(userId);
    }

    default List<Address> findBillingAddresses(Long userId) {
        return findByUserId(userId);
    }
}