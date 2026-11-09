/* Section dictionary for method.*, stack.* and contact.* body keys (plan 03-02). Loaded after en.js and before boot.js. */
Object.assign(window.I18N.pt, {
  "method.step1.body": "Cada entrega é dividida em fases. Toda fase segue o mesmo ciclo: pesquisa, mapeamento de padrões, plano, checagem do plano, execução por ondas, verificação e fechamento.",
  "method.step2.body": "A branch principal é protegida: mudanças entram só por pull request, sem force push nem exclusão. Em um dos projetos há duas branches protegidas, integração e produção, com CI obrigatório e promoção manual.",
  "method.step3.body": "Cada fase roda na própria branch e fecha com um pull request, com commits atômicos a cada tarefa. A fase seguinte só começa depois do merge, e o merge é sempre uma decisão humana.",
  "method.step4.body": "Um verificador independente reconfere cada fase ao vivo, sem se apoiar só no resumo de quem executou, e já encontrou lacunas reais de qualidade. Entregas visuais passam por checkpoint humano em navegador real; em uma fase, ele achou 4 bugs que nenhum teste automatizado pegaria.",
  "method.note": "Verificações adiadas recebem o status formal PASS-WITH-KNOWN-GAP, com a lacuna declarada, em vez de serem dadas como aprovadas. Segredos reais nunca são versionados.",
  "contact.body": "Se a plataforma de dados, o método ou os projetos fazem sentido para a sua equipe, escreva. Posso detalhar qualquer decisão de arquitetura desta página em uma conversa."
});
Object.assign(window.I18N.en, {
  "method.step1.body": "Every delivery is split into phases. Each phase follows the same cycle: research, pattern mapping, plan, plan check, wave-by-wave execution, verification and close.",
  "method.step2.body": "The main branch is protected: changes land only through a pull request, with no force push and no deletion. One project has two protected branches, integration and production, with mandatory CI and manual promotion.",
  "method.step3.body": "Each phase runs on its own branch and closes with a pull request, with atomic commits after every task. The next phase starts only after the merge, and the merge is always a human decision.",
  "method.step4.body": "An independent verifier re-checks each phase live, without relying only on the executor summary, and it has found real quality gaps. Visual deliverables go through a human checkpoint in a real browser; in one phase it caught 4 bugs that no automated test would.",
  "method.note": "Deferred verifications get the formal status PASS-WITH-KNOWN-GAP, with the gap stated, instead of being marked as passed. Real secrets are never committed.",
  "contact.body": "If the data platform, the method or the projects fit your team, get in touch. I can walk through any architecture decision on this page in a conversation."
});
