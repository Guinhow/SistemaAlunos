package com.seuprojeto.gestaoalunos.controller;

import com.seuprojeto.gestaoalunos.model.Contrato;
import com.seuprojeto.gestaoalunos.repository.ContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contratos")
public class ContratoController {

    @Autowired
    private ContratoRepository repository;

    @GetMapping
    public List<Contrato> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Contrato salvar(@RequestBody Contrato contrato) {
        return repository.save(contrato);
    }
}
