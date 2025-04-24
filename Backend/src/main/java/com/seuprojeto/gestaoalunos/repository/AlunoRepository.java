package com.seuprojeto.gestaoalunos.repository;

import com.seuprojeto.gestaoalunos.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {}
