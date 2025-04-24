package com.seuprojeto.gestaoalunos.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

import com.seuprojeto.gestaoalunos.model.Contrato;
import com.seuprojeto.gestaoalunos.model.Pagamento;
import com.seuprojeto.gestaoalunos.model.Turma;
import com.seuprojeto.gestaoalunos.model.Aluno;

import com.seuprojeto.gestaoalunos.repository.AlunoRepository;
import com.seuprojeto.gestaoalunos.repository.TurmaRepository;
import com.seuprojeto.gestaoalunos.repository.ContratoRepository;
import com.seuprojeto.gestaoalunos.repository.PagamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

// @RestController
// @RequestMapping("/alunos")
// public class AlunoController {

//     @Autowired
//     private AlunoRepository repository;

//     @GetMapping
//     public List<Aluno> listar() {
//         return repository.findAll();
//     }

//     @PostMapping
//     public Aluno salvar(@RequestBody Aluno aluno) {
//         return repository.save(aluno);
//     }
// }
@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping("/quantidade")
    public Long contarAlunos() {
        return alunoRepository.count();
    }
    
    @GetMapping
    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @PostMapping("/completo")
    public ResponseEntity<?> cadastrarAlunoCompleto(@RequestBody Map<String, Object> dados) {
        try {
            // Dados básicos
            String nome = (String) dados.get("nome");
            String cpf = (String) dados.get("cpf");
            String telefone = (String) dados.get("telefone");
            String email = (String) dados.get("email");
            Long turmaId = Long.valueOf(dados.get("turmaId").toString());
            Double valorTotal = Double.valueOf(dados.get("valorTotal").toString());
            Integer parcelas = Integer.valueOf(dados.get("parcelas").toString());
            LocalDate nascimento = LocalDate.parse((String) dados.get("nascimento"));

            Turma turma = turmaRepository.findById(turmaId).orElseThrow(() -> new RuntimeException("Turma não encontrada"));

            // 1. Cadastrar aluno
            Aluno aluno = new Aluno();
            aluno.setNome(nome);
            aluno.setCpf(cpf);
            aluno.setTelefone(telefone);
            aluno.setEmail(email);
            aluno.setNascimento(nascimento);
            aluno.setTurma(turma);
            aluno.setStatus("ativo");

            aluno = alunoRepository.save(aluno);

            // 2. Criar contrato
            Contrato contrato = new Contrato();
            contrato.setAluno(aluno);
            contrato.setTurma(turma);
            contrato.setDataInicio(LocalDate.now());
            contrato.setDataFim(LocalDate.now().plusMonths(parcelas));
            contrato.setStatus("ativo");
            contrato.setParcelas(parcelas);
            contrato.setValorTotal(valorTotal);

            contrato = contratoRepository.save(contrato);

            // 3. Criar pagamentos
            double valorParcela = valorTotal / parcelas;
            for (int i = 1; i <= parcelas; i++) {
                Pagamento pagamento = new Pagamento();
                pagamento.setContrato(contrato);
                pagamento.setNumeroParcela(i);
                pagamento.setValor(valorParcela);
                pagamento.setVencimento(LocalDate.now().plusMonths(i));
                pagamento.setDataPagamento(null);
                pagamento.setStatus("pendente");
                pagamentoRepository.save(pagamento);
            }

            return ResponseEntity.ok("Aluno, contrato e pagamentos cadastrados com sucesso!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao cadastrar aluno: " + e.getMessage());
        }
    }
}