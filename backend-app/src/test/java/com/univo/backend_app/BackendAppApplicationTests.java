package com.univo.backend_app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.UUID;

@SpringBootTest
class BackendAppApplicationTests {

	@DynamicPropertySource
	static void appProperties(DynamicPropertyRegistry registry) {
		registry.add("app.jwt.secret", () -> UUID.randomUUID().toString() + UUID.randomUUID());
		registry.add("GROQ_API_KEY", () -> UUID.randomUUID().toString());
		registry.add("DB_URL", () -> "jdbc:h2:mem:taskhive-test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1");
		registry.add("DB_USERNAME", () -> "sa");
		registry.add("DB_PASSWORD", () -> "");
		registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
		registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.H2Dialect");
	}

	@Test
	void contextLoads() {
	}

}
