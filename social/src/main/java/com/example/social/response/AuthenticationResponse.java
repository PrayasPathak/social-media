package com.example.social.response;

import lombok.Builder;

@Builder
public record AuthenticationResponse(
        String accessToken,
        boolean status,
        String refreshToken
) {

}
