package fit.iuh.services;

import fit.iuh.dto.UserDTO;
import fit.iuh.models.Address;
import fit.iuh.models.Role;
import fit.iuh.models.User;
import fit.iuh.repositories.RoleRepository;
import fit.iuh.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDTO);
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Xử lý roles
        Set<Role> roles = new HashSet<>();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleName : userDTO.getRoles()) {
                // Xử lý prefix ROLE_ nếu chưa có
                String normalizedRoleName = roleName.startsWith("ROLE_") ?
                        roleName : "ROLE_" + roleName.toUpperCase();

                Role role = roleRepository.findByName(Role.RoleName.valueOf(normalizedRoleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + normalizedRoleName));
                roles.add(role);
            }
        } else {
            // Gán role mặc định là USER nếu không có role nào được chỉ định
            Role defaultRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            roles.add(defaultRole);
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }

        User user = convertToEntity(userDTO);
        user.setId(id);

        // Only update password if provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        } else {
            // Keep existing password
            userRepository.findById(id).ifPresent(existingUser ->
                    user.setPassword(existingUser.getPassword())
            );
        }

        // Xử lý roles khi cập nhật
        User existingUser = userRepository.findById(id).get();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : userDTO.getRoles()) {
                String normalizedRoleName = roleName.startsWith("ROLE_") ?
                        roleName : "ROLE_" + roleName.toUpperCase();

                Role role = roleRepository.findByName(Role.RoleName.valueOf(normalizedRoleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + normalizedRoleName));
                roles.add(role);
            }
            user.setRoles(roles);
        } else {
            // Giữ nguyên roles hiện tại nếu không có cập nhật
            user.setRoles(existingUser.getRoles());
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    // Helper methods for DTO conversion
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());

        // Map roles to DTO - SỬA PHẦN NÀY
        if (user.getRoles() != null) {
            Set<Role.RoleName> roleNames = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toSet());
            Set<String> roleNamesAsString = roleNames.stream()
                    .map(Enum::name)
                    .collect(Collectors.toSet());
            dto.setRoles(roleNamesAsString);
        }

        // Map addresses if needed
        if (user.getAddresses() != null) {
            Set<UserDTO.AddressDTO> addressDTOs = user.getAddresses().stream()
                    .map(address -> {
                        UserDTO.AddressDTO addressDTO = new UserDTO.AddressDTO();
                        addressDTO.setId(address.getId());
                        addressDTO.setStreetAddress(address.getStreetAddress());
                        addressDTO.setCity(address.getCity());
                        addressDTO.setState(address.getState());
                        addressDTO.setPostalCode(address.getPostalCode());
                        addressDTO.setCountry(address.getCountry());
                        addressDTO.setPhoneNumber(address.getPhoneNumber());
                        addressDTO.setDefault(address.isDefault());

                        // Chuyển đổi từ enum sang String
                        if (address.getType() != null) {
                            addressDTO.setAddressType(address.getType().name());
                        }

                        return addressDTO;
                    })
                    .collect(Collectors.toSet());
            dto.setAddresses(addressDTOs);
        }

        return dto;
    }

    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        // Map addresses if needed
        if (dto.getAddresses() != null) {
            Set<Address> addresses = dto.getAddresses().stream()
                    .map(addressDTO -> {
                        Address address = new Address();
                        address.setId(addressDTO.getId());
                        address.setStreetAddress(addressDTO.getStreetAddress());
                        address.setCity(addressDTO.getCity());
                        address.setState(addressDTO.getState());
                        address.setPostalCode(addressDTO.getPostalCode());
                        address.setCountry(addressDTO.getCountry());
                        address.setPhoneNumber(addressDTO.getPhoneNumber());
                        address.setDefault(addressDTO.isDefault());

                        // Chuyển đổi từ String sang enum
                        if (addressDTO.getAddressType() != null) {
                            try {
                                address.setType(Address.AddressType.valueOf(addressDTO.getAddressType()));
                            } catch (IllegalArgumentException e) {
                                System.out.println("Warning: Invalid address type: " + addressDTO.getAddressType());
                            }
                        }

                        address.setUser(user);
                        return address;
                    })
                    .collect(Collectors.toSet());
            user.setAddresses(addresses);
        }

        return user;
    }
}