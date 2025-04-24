package com.seuprojeto.gestaoalunos.controller;

import com.seuprojeto.gestaoalunos.model.Turma;
import com.seuprojeto.gestaoalunos.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
public class TurmaController {

    @Autowired
    private TurmaRepository repository;

    @GetMapping
    public List<Turma> listar() {
        return repository.findAll();
    }

    @GetMapping("/quantidade")
    public Long contarTurmas() {
        return repository.count();
    }
    
    @PostMapping
    public Turma salvar(@RequestBody Turma turma) {
        return repository.save(turma);
    }
}
