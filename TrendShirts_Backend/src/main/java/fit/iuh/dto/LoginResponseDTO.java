package fit.iuh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String name;
    private List<String> roles;

    public LoginResponseDTO(String token) {
        this.token = token;
    }

    public LoginResponseDTO(String token, Long id, String email, String name, List<String> roles) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }
}