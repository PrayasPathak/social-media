package com.example.social.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {
    @NotBlank(message = "Full Name is required")
    @Size(min = 5, message = "Full name must be at least 5 characters long")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is not properly formatted")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[*&^%$#@!()]).{8,}$",
            message = "Password must be at least 8 characters and include at least 1 lowercase, 1 uppercase, 1 digit, and 1 special characters")
    private String password;
}
