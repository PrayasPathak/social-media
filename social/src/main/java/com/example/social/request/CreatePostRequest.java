package com.example.social.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePostRequest {
    @NotEmpty(message = "Caption is required")
    private String caption;
    @NotNull(message = "Media is required")
    MultipartFile media;
}
