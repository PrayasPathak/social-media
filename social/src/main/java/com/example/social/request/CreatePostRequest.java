package com.example.social.request;

import jakarta.validation.constraints.NotEmpty;
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
    @NotEmpty(message = "Media is required")
    MultipartFile media;
}
