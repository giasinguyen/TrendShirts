package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // Only used for input, never returned
    private String phoneNumber;
    private Set<AddressDTO> addresses = new HashSet<>();
    private Set<String> roles = new HashSet<>();


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDTO {
        private Long id;
        private String streetAddress;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private String phoneNumber;
        private boolean isDefault;
        private String addressType;
    }
}