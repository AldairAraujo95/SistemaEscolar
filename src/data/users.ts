import type { Guardian, Teacher, Student } from "@/types";

export const guardians: Guardian[] = [
  { id: "g1", name: "Ana Silva", email: "ana.silva@example.com", phone: "(11) 98765-4321" },
  { id: "g2", name: "Carlos Souza", email: "carlos.souza@example.com", phone: "(21) 91234-5678" },
  { id: "g3", name: "Beatriz Lima", email: "beatriz.lima@example.com", phone: "(31) 98888-1111" },
  { id: "g4", name: "Daniel Alves", email: "daniel.alves@example.com", phone: "(41) 97777-2222" },
  { id: "g5", name: "Eduarda Costa", email: "eduarda.costa@example.com", phone: "(51) 96666-3333" },
  { id: "g6", name: "Felipe Pereira", email: "felipe.pereira@example.com", phone: "(61) 95555-4444" },
  { id: "g7", name: "Gabriela Martins", email: "gabriela.martins@example.com", phone: "(71) 94444-5555" },
  { id: "g8", name: "Heitor Santos", email: "heitor.santos@example.com", phone: "(81) 93333-6666" },
  { id: "g9", name: "Isabela Rocha", email: "isabela.rocha@example.com", phone: "(91) 92222-7777" },
  { id: "g10", name: "João Oliveira", email: "joao.oliveira@example.com", phone: "(12) 91111-8888" },
  ...Array.from({ length: 40 }, (_, i) => {
    const id = i + 11;
    const firstNames = ["Lucas", "Mariana", "Pedro", "Juliana", "Rafael", "Camila", "Gustavo", "Larissa"];
    const lastNames = ["Ferreira", "Gomes", "Ribeiro", "Carvalho", "Mendes", "Nunes", "Barbosa", "Pinto"];
    const name = `${firstNames[i % 8]} ${lastNames[i % 8]}`;
    return {
      id: `g${id}`,
      name: name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      phone: `(11) 9${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    };
  })
];

export const teachers: Teacher[] = [
  { id: "t1", name: "Prof. Ricardo", email: "ricardo@school.com", subjects: ["Matemática", "Física"], classes: ["5º Ano A", "6º Ano B"] },
  { id: "t2", name: "Profa. Mariana", email: "mariana@school.com", subjects: ["Português", "História"], classes: ["5º Ano A", "3º Ano A"] },
];

export const students: Student[] = [
  { id: "s1", name: "Lucas Silva", cpf: "111.222.333-44", guardianId: "g1", class: "5º Ano A" },
  { id: "s2", name: "Beatriz Souza", cpf: "222.333.444-55", guardianId: "g2", class: "6º Ano B" },
  { id: "s3", name: "Pedro Silva", cpf: "333.444.555-66", guardianId: "g1", class: "3º Ano A" },
  { id: "s4", name: "Clara Lima", cpf: "444.555.666-77", guardianId: "g3", class: "3º Ano A" },
  { id: "s5", name: "Miguel Alves", cpf: "555.666.777-88", guardianId: "g4", class: "5º Ano A" },
  { id: "s6", name: "Sofia Costa", cpf: "666.777.888-99", guardianId: "g5", class: "6º Ano B" },
  ...guardians.slice(5).map((guardian, i) => {
    const studentId = i + 7;
    const studentFirstName = ["Arthur", "Laura", "Bernardo", "Valentina", "Davi", "Helena", "Lorenzo", "Manuela"][i % 8];
    const guardianLastName = guardian.name.split(" ")[1];
    return {
      id: `s${studentId}`,
      name: `${studentFirstName} ${guardianLastName}`,
      cpf: `${String(Math.floor(Math.random() * 900) + 100)}.${String(Math.floor(Math.random() * 900) + 100)}.${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 90) + 10)}`,
      guardianId: guardian.id,
      class: ["3º Ano A", "5º Ano A", "6º Ano B"][i % 3]
    };
  })
];