package com.seuprojeto.gestaoalunos.repository;

import com.seuprojeto.gestaoalunos.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByStatus(String status);
}