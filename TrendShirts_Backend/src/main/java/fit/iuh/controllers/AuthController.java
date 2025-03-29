package fit.iuh.controllers;

import fit.iuh.dto.LoginRequestDTO;
import fit.iuh.dto.LoginResponseDTO;
import fit.iuh.dto.RegisterRequestDTO;
import fit.iuh.dto.UserDTO;
import fit.iuh.models.Role;
import fit.iuh.models.User;
import fit.iuh.security.JwtTokenProvider;
import fit.iuh.security.UserDetailsImpl;
import fit.iuh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy UserDetailsImpl (KHÔNG phải User)
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = tokenProvider.generateToken(authentication);

        // Lấy roles từ UserDetailsImpl
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        // Tạo response đầy đủ
        LoginResponseDTO response = new LoginResponseDTO(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getName(),
                roles
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequestDTO registerRequest) {
        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName(registerRequest.getFirstName());
        userDTO.setLastName(registerRequest.getLastName());
        userDTO.setEmail(registerRequest.getEmail());
        userDTO.setPassword(registerRequest.getPassword());
        userDTO.setPhoneNumber(registerRequest.getPhoneNumber());

        if (registerRequest.getRole() != null && !registerRequest.getRole().isEmpty()) {
            Set<String> roles = new HashSet<>();
            roles.add(registerRequest.getRole());
            userDTO.setRoles(roles);
        }

        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }
}