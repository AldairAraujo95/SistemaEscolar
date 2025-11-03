# Apresentação: Sistema de Gestão Escolar

Este projeto é um Sistema de Gestão Escolar (SGE) completo, uma aplicação web moderna desenhada para centralizar e facilitar as operações diárias de uma instituição de ensino.

A plataforma unifica a gestão acadêmica, financeira e administrativa, oferecendo portais dedicados para cada tipo de usuário, garantindo uma experiência focada e segura para administradores, professores e alunos/responsáveis.

## Módulos e Funcionalidades Principais

O sistema é dividido em portais, cada um com um conjunto específico de ferramentas:

### 1. Portal do Administrador
O centro de controle do sistema, onde toda a gestão da escola é realizada.

- **Gestão de Usuários:** Cadastro e edição de Alunos, Responsáveis (Pais) e Professores.
- **Gestão Acadêmica:** Criação e gerenciamento de Turmas (ex: "7º Ano C") e Disciplinas (ex: "Matemática").
- **Gestão Financeira:** O administrador pode adicionar boletos individualmente ou gerar boletos em lote para todos os responsáveis. A página inclui um dashboard visual para acompanhar pagamentos (Pagos, A Vencer, Vencidos).
- **Comunicação:** Gerencia a Agenda Escolar (adicionando eventos, provas, feriados) e monitora o Feed de Atividades.

### 2. Portal do Professor
Focado nas ferramentas de sala de aula e acompanhamento dos alunos.

- **Lançamento de Notas:** Interface para selecionar turma, aluno e unidade para registrar as notas.
- **Feed de Atividades:** Permite ao professor postar novas atividades (com descrição e data de entrega) para suas turmas.
- **Agenda Escolar:** Visualização dos eventos da escola.

### 3. Portal do Aluno / Responsável
Um portal de autoatendimento para que alunos e seus responsáveis possam acompanhar a vida acadêmica e financeira.

- **Minhas Notas:** Tela dedicada onde o aluno pode consultar seu boletim, com notas separadas por unidade e disciplina.
- **Financeiro:** Permite ao responsável visualizar todos os boletos de mensalidade, verificar o status (Pago, A Vencer, Vencido) e baixar os arquivos PDF.
- **Feed de Atividades:** Lista de todas as atividades postadas pelos professores para a turma do aluno.
- **Agenda Escolar:** Acesso ao calendário de eventos da escola.

## Tecnologias Utilizadas

- **Frontend:** React com TypeScript
- **UI (Interface):** shadcn/ui e Tailwind CSS
- **Roteamento:** React Router DOM
- **Backend e Banco de Dados:** Supabase (utilizado para autenticação e gerenciamento de dados, como os boletos financeiros)