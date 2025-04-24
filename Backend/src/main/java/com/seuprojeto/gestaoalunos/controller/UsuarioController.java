// package com.seuprojeto.gestaoalunos.controller;

// import com.seuprojeto.gestaoalunos.model.Usuario;
// import com.seuprojeto.gestaoalunos.repository.UsuarioRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/usuarios")
// public class UsuarioController {

//     @Autowired
//     private UsuarioRepository repository;

//     @GetMapping
//     public List<Usuario> listar() {
//         return repository.findAll();
//     }

//     @PostMapping
//     public Usuario salvar(@RequestBody Usuario usuario) {
//         return repository.save(usuario);
//     }
// }
package com.seuprojeto.gestaoalunos.controller;

import com.seuprojeto.gestaoalunos.model.Usuario;
import com.seuprojeto.gestaoalunos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // @GetMapping
    // public List<Usuario> listar() {
    //     return repository.findAll();
    // }

    // @PostMapping
    // public Usuario salvar(@RequestBody Usuario usuario) {
    //     return repository.save(usuario);
    // }

    @PostMapping("/autenticar")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        if (usuario.getUsuario() == null || usuario.getSenha() == null ||
            usuario.getUsuario().isEmpty() || usuario.getSenha().isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário ou senha não podem ser vazios.");
        }

        Optional<Usuario> usuarioEncontrado = repository.findByUsuarioAndSenha(
            usuario.getUsuario(), usuario.getSenha()
        );

        if (usuarioEncontrado.isPresent()) {
            return ResponseEntity.ok("Login realizado com sucesso!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha inválidos.");
        }
    }
}
