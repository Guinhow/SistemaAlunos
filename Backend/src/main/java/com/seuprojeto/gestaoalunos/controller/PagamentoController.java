package com.seuprojeto.gestaoalunos.controller;

import com.seuprojeto.gestaoalunos.model.Pagamento;
import com.seuprojeto.gestaoalunos.repository.PagamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoRepository repository;

    @GetMapping
    public List<Pagamento> listar() {
        return repository.findAll();
    }

    @GetMapping("/pendentes")
    public List<Pagamento> listarPendentes() {
        return repository.findByStatus("pendente");
    }
    
    @GetMapping("/quitados")
    public List<Pagamento> listarQuitados() {
        return repository.findByStatus("pago");
    }

    @PutMapping("/{id}/quitar")
    public ResponseEntity<Pagamento> quitar(@PathVariable Long id) {
        Optional<Pagamento> pagamentoOpt = repository.findById(id);
        if (pagamentoOpt.isPresent()) {
            Pagamento pagamento = pagamentoOpt.get();
            pagamento.setStatus("pago");
            pagamento.setDataPagamento(LocalDate.now());
            return ResponseEntity.ok(repository.save(pagamento));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Pagamento salvar(@RequestBody Pagamento pagamento) {
        return repository.save(pagamento);
    }
}
