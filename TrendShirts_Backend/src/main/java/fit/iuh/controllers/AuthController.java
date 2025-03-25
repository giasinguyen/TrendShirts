package fit.iuh.controllers;

import fit.iuh.dto.LoginRequestDTO;
import fit.iuh.dto.LoginResponseDTO;
import fit.iuh.dto.RegisterRequestDTO;
import fit.iuh.dto.UserDTO;
import fit.iuh.security.JwtTokenProvider;
import fit.iuh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new LoginResponseDTO(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequestDTO registerRequest) {
        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName(registerRequest.getFirstName());
        userDTO.setLastName(registerRequest.getLastName());
        userDTO.setEmail(registerRequest.getEmail());
        userDTO.setPassword(registerRequest.getPassword());
        userDTO.setPhoneNumber(registerRequest.getPhoneNumber());

        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }
}