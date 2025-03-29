package fit.iuh.dto;

import lombok.Data;
import java.util.Set;

@Data
public class LoginResponseDTO {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String name;
    private Set<String> roles;

    public LoginResponseDTO(String token) {
        this.token = token;
    }

    // Constructor đầy đủ
    public LoginResponseDTO(String token, Long id, String email, String name, Set<String> roles) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }
}