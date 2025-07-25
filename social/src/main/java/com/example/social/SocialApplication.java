package com.example.social;

import com.example.social.entity.Role;
import com.example.social.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.Set;

@SpringBootApplication
public class SocialApplication {
	public static void main(String[] args) {
		SpringApplication.run(SocialApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(RoleRepository roleRepository) {
		return args -> {
			Set<String> requiredRoles = Set.of("ROLE_USER", "ROLE_ADMIN");
			for (String roleName : requiredRoles) {
				roleRepository.findByName(roleName).orElseGet(() -> {
					Role role = Role.builder()
							.name(roleName)
							.createdDate(LocalDateTime.now())
							.build();
					return roleRepository.save(role);
				});
			}
		};
	}
}
