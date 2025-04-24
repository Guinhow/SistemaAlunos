package com.seuprojeto.gestaoalunos.repository;

import com.seuprojeto.gestaoalunos.model.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsuario(String usuario);
    Optional<Usuario> findByUsuarioAndSenha(String usuario, String senha);
}
