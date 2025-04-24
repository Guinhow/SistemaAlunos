package com.seuprojeto.gestaoalunos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeRequests()
            .requestMatchers("/**").permitAll() // Permite acesso a todos os endpoints durante desenvolvimento
            .and()
            .formLogin().disable() // Desabilita o formulário de login
            .httpBasic().disable(); // Desabilita autenticação HTTP Basic
        
        return http.build();
    }
}